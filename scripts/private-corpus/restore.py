"""Download and verify the private corpus, then restore it without overwriting changes."""
import argparse
import hashlib
import io
import json
import os
import sqlite3
import tarfile
import tempfile
import time
from pathlib import Path, PurePosixPath
import zstandard
from common import REPO, REPOSITORY, SOURCE, TAG, TRANSFER, checked_json, github_session, sha256_file


class PartsReader(io.RawIOBase):
    def __init__(self, paths):
        super().__init__()
        self.paths = iter(paths)
        self.stream = None

    def readable(self):
        return True

    def readinto(self, buffer):
        while True:
            if self.stream is None:
                path = next(self.paths, None)
                if path is None:
                    return 0
                self.stream = open(path, "rb")
            count = self.stream.readinto(buffer)
            if count:
                return count
            self.stream.close()
            self.stream = None

    def close(self):
        if self.stream:
            self.stream.close()
        super().close()


def safe_name(name):
    if not name or Path(name).name != name or "\\" in name or ":" in name or name in {".", ".."}:
        raise RuntimeError("Unsafe release asset name.")
    return name


def safe_target(destination, prefix, name):
    relative = PurePosixPath(name)
    if relative.is_absolute() or ".." in relative.parts or "\\" in name or ":" in name:
        raise RuntimeError("Unsafe archive path.")
    allowed = PurePosixPath(prefix)
    if relative.parts[:len(allowed.parts)] != allowed.parts:
        raise RuntimeError("Archive member is outside its source prefix.")
    target = destination.joinpath(*relative.parts)
    resolved = target.resolve()
    if destination.resolve() not in resolved.parents:
        raise RuntimeError("Archive path escapes the destination, possibly through a symlink.")
    return target


def download(session, asset, path, expected=None):
    if path.exists() and expected and path.stat().st_size == expected["bytes"] and sha256_file(path) == expected["sha256"]:
        print(f"Verified cached asset: {path.name}", flush=True)
        return
    if path.exists():
        raise RuntimeError(f"Existing download differs: {path}; preserve or move it before retrying.")
    temporary = path.with_name(path.name + ".download")
    digest, size, last = hashlib.sha256(), 0, time.monotonic()
    with session.get(asset["url"], headers={"Accept": "application/octet-stream"}, stream=True, timeout=(60, 180)) as response:
        if response.status_code != 200:
            raise RuntimeError(f"Download failed: HTTP {response.status_code}.")
        with open(temporary, "wb") as output:
            for block in response.iter_content(8 * 1024 * 1024):
                output.write(block)
                digest.update(block)
                size += len(block)
                if size > asset["size"]:
                    raise RuntimeError("Download exceeds its recorded size.")
                if time.monotonic() - last >= 20:
                    print(f"Downloading {path.name}: {size:,}/{asset['size']:,} bytes", flush=True)
                    last = time.monotonic()
    if size != asset["size"] or (expected and (size != expected["bytes"] or digest.hexdigest() != expected["sha256"])):
        raise RuntimeError(f"Download verification failed: {path.name}.")
    if asset.get("digest") and asset["digest"] != "sha256:" + digest.hexdigest():
        raise RuntimeError(f"Remote digest mismatch: {path.name}.")
    os.replace(temporary, path)
    print(f"Downloaded and verified: {path.name}", flush=True)


def extract(manifest, directory, destination):
    prefix = manifest["source_prefix"]
    records = {}
    with open(directory / manifest["file_manifest"]["name"], encoding="utf-8") as stream:
        for line in stream:
            row = json.loads(line)
            safe_target(destination, prefix, row["path"])
            if row["path"] in records:
                raise RuntimeError("Duplicate file in manifest.")
            records[row["path"]] = row
    if len(records) != manifest["files"]:
        raise RuntimeError("File manifest count mismatch.")
    restored = set()
    last = time.monotonic()
    with io.BufferedReader(PartsReader([directory / part["name"] for part in manifest["parts"]])) as source:
        with zstandard.ZstdDecompressor().stream_reader(source) as decompressed:
            with tarfile.open(fileobj=decompressed, mode="r|") as archive:
                for member in archive:
                    if not member.isfile() or member.name not in records or member.name in restored:
                        raise RuntimeError("Unexpected archive member/type or duplicate.")
                    row = records[member.name]
                    if member.size != row["bytes"]:
                        raise RuntimeError("Archive member size mismatch.")
                    target = safe_target(destination, prefix, member.name)
                    exists = target.exists()
                    if exists and (not target.is_file() or target.stat().st_size != row["bytes"] or sha256_file(target) != row["sha256"]):
                        raise RuntimeError(f"Refusing to overwrite changed file: {target}")
                    target.parent.mkdir(parents=True, exist_ok=True)
                    temporary = None
                    output = None
                    if not exists:
                        output = tempfile.NamedTemporaryFile(prefix=".corpus-restore-", suffix=".tmp", dir=target.parent, delete=False)
                        temporary = Path(output.name)
                    digest = hashlib.sha256()
                    try:
                        with archive.extractfile(member) as body:
                            for block in iter(lambda: body.read(8 * 1024 * 1024), b""):
                                digest.update(block)
                                if output:
                                    output.write(block)
                        if output:
                            output.close()
                        if digest.hexdigest() != row["sha256"]:
                            raise RuntimeError(f"Restored file digest mismatch: {member.name}")
                        if temporary:
                            if target.exists():
                                raise RuntimeError("Destination changed during restore.")
                            temporary.rename(target)
                            os.utime(target, (member.mtime, member.mtime))
                    finally:
                        if output and not output.closed:
                            output.close()
                        if temporary and temporary.exists():
                            temporary.unlink()
                    restored.add(member.name)
                    if time.monotonic() - last >= 15:
                        print(f"Restored and hashed {len(restored):,}/{len(records):,} files", flush=True)
                        last = time.monotonic()
    if restored != set(records):
        raise RuntimeError("Archive is incomplete.")
    receipt = manifest.get("database_receipt")
    if receipt:
        database = destination / prefix / "private-corpus/corpus.sqlite"
        row = records.get(database.relative_to(destination).as_posix())
        if row is None or row["sha256"] != receipt["sha256"] or row["bytes"] != receipt["bytes"]:
            raise RuntimeError("Restored database differs from acquisition receipt.")
        with sqlite3.connect(database.as_uri() + "?mode=ro", uri=True) as connection:
            counts = {"text_bodies": connection.execute("SELECT count(*) FROM bodies").fetchone()[0],
                      "documents": connection.execute("SELECT count(*) FROM documents").fetchone()[0],
                      "PDF_assets": connection.execute("SELECT count(*) FROM source_assets").fetchone()[0]}
        for key, value in counts.items():
            if value != receipt["current_totals"][key]:
                raise RuntimeError(f"Restored database count mismatch: {key}.")
        print("Database verified: " + json.dumps(counts), flush=True)
    return len(restored)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--directory", type=Path, default=TRANSFER)
    parser.add_argument("--destination", type=Path, default=REPO)
    parser.add_argument("--tag", default=TAG)
    parser.add_argument("--manifest", type=Path, help="Use an already-downloaded local archive instead of GitHub.")
    parser.add_argument("--manifest-sha256")
    args = parser.parse_args()
    directory = args.directory.resolve()
    directory.mkdir(parents=True, exist_ok=True)
    manifest_path = args.manifest.resolve() if args.manifest else directory / "manifest.json"
    expected_sha = args.manifest_sha256
    if not args.manifest:
        receipt_path = REPO / "docs/content/private-corpus-transfer.json"
        if not expected_sha and receipt_path.exists():
            transfer_receipt = json.loads(receipt_path.read_text(encoding="utf-8"))
            if transfer_receipt.get("complete"):
                expected_sha = transfer_receipt["manifest_sha256"]
        if not expected_sha:
            raise RuntimeError("A committed transfer receipt or --manifest-sha256 is required.")
        session = github_session()
        base = f"https://api.github.com/repos/{REPOSITORY}"
        release = checked_json(session.get(f"{base}/releases/tags/{args.tag}", timeout=60))
        assets = {}
        page = 1
        while True:
            batch = checked_json(session.get(f"{base}/releases/{release['id']}/assets", params={"per_page": 100, "page": page}, timeout=60))
            assets.update({row["name"]: row for row in batch})
            if len(batch) < 100:
                break
            page += 1
        download(session, assets["manifest.json"], manifest_path,
                 {"bytes": assets["manifest.json"]["size"], "sha256": expected_sha})
    if expected_sha and sha256_file(manifest_path) != expected_sha:
        raise RuntimeError("Manifest digest differs from handoff receipt.")
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    if manifest.get("format") != "sandhya-private-corpus-tar-zstd-v1" or manifest.get("repository") != REPOSITORY:
        raise RuntimeError("Unknown archive format/repository.")
    if manifest["source_prefix"] != SOURCE.relative_to(REPO).as_posix():
        raise RuntimeError("Unexpected corpus source prefix.")
    if args.manifest:
        directory = manifest_path.parent
    for item in manifest["parts"] + [manifest["file_manifest"]]:
        path = directory / safe_name(item["name"])
        if not args.manifest:
            download(session, assets[item["name"]], path, item)
        if path.stat().st_size != item["bytes"] or sha256_file(path) != item["sha256"]:
            raise RuntimeError(f"Archive asset verification failed: {item['name']}")
    count = extract(manifest, directory, args.destination.resolve())
    print(f"Restore complete: {count:,} individually verified files. Read the continuation checkpoint before collecting.", flush=True)


if __name__ == "__main__":
    main()
