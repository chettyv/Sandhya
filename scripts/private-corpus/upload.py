"""Resume private GitHub release uploads; verify every remote asset digest."""
import argparse
import json
import subprocess
import time
from pathlib import Path
from urllib.parse import quote
from common import REPOSITORY, TAG, TRANSFER, checked_json, github_session, sha256_file


class ProgressFile:
    def __init__(self, stream, size, name):
        self.stream, self.size, self.name = stream, size, name
        self.last = time.monotonic()

    def __len__(self):
        return self.size

    def read(self, size=-1):
        data = self.stream.read(size)
        if time.monotonic() - self.last >= 20:
            print(f"Uploading {self.name}: {self.stream.tell():,}/{self.size:,} bytes", flush=True)
            self.last = time.monotonic()
        return data


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--directory", type=Path, default=TRANSFER)
    parser.add_argument("--tag", default=TAG)
    parser.add_argument("--watch-pack", action="store_true", help="Upload sealed parts while packing is still running.")
    parser.add_argument("--part", type=int, help="Upload one sealed part; keep the release draft.")
    parser.add_argument("--prepare-release", action="store_true", help="Resolve the canonical draft before starting parallel workers.")
    args = parser.parse_args()
    directory = args.directory.resolve()
    manifest_path = directory / "manifest.json"
    def pending_files():
        if args.part:
            path = directory / f"corpus.tar.zst.part-{args.part:04d}"
            yield {"name": path.name, "bytes": path.stat().st_size, "sha256": sha256_file(path)}
            return
        offered = set()
        while args.watch_pack and not manifest_path.exists():
            # The packer closes each part before opening the next. Never read its active last part.
            sealed = sorted(directory.glob("corpus.tar.zst.part-*"))[:-1]
            for path in sealed:
                if path.name not in offered:
                    offered.add(path.name)
                    yield {"name": path.name, "bytes": path.stat().st_size, "sha256": sha256_file(path)}
            if not manifest_path.exists():
                time.sleep(5)
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
        yield from manifest["parts"]
        yield manifest["file_manifest"]
        yield {"name": "manifest.json", "bytes": manifest_path.stat().st_size,
               "sha256": sha256_file(manifest_path)}
    session = github_session()
    base = f"https://api.github.com/repos/{REPOSITORY}"
    reference_path = directory / "release-reference.json"
    release = None
    if reference_path.exists():
        reference = json.loads(reference_path.read_text(encoding="utf-8"))
        if reference["tag"] != args.tag:
            raise RuntimeError("Local release reference has a different tag.")
        release = checked_json(session.get(f"{base}/releases/{reference['id']}", timeout=60))
    else:
        response = session.get(f"{base}/releases/tags/{quote(args.tag, safe='')}", timeout=60)
        if response.status_code == 404:
            # Draft tags are absent from the tag endpoint; list authenticated draft releases.
            drafts = checked_json(session.get(f"{base}/releases", params={"per_page": 100}, timeout=60))
            matches = [row for row in drafts if row["tag_name"] == args.tag]
            if matches:
                release = min(matches, key=lambda row: (row["created_at"], row["id"]))
        else:
            release = checked_json(response)
    if release is None:
        commit = subprocess.check_output(["git", "rev-parse", "HEAD"], text=True).strip()
        remote = subprocess.check_output(["git", "ls-remote", "origin", "refs/heads/main"], text=True).split()[0]
        if commit != remote:
            raise RuntimeError("Push the handoff commit to main before creating the release.")
        release = checked_json(session.post(f"{base}/releases", json={
            "tag_name": args.tag, "target_commitish": commit, "draft": True,
            "name": "Private scripture corpus handoff — 5 October 2026",
            "body": "Private acquisition checkpoint, including the SQLite corpus, source scans, extractions, scripts and evidence. Read docs/content/private-corpus-handoff.md in the repository and use scripts/private-corpus/restore.py. All parts and individual files have SHA256 checks. Collection is incomplete; known gaps are preserved. No application import or publication clearance is implied."
        }, timeout=60))
    if release["tag_name"] != args.tag:
        raise RuntimeError("Remote release has an unexpected tag.")
    if not reference_path.exists():
        reference_path.write_text(json.dumps({"tag": args.tag, "id": release["id"]}) + "\n", encoding="utf-8")
    if args.prepare_release:
        print(json.dumps({"release_id": release["id"], "draft": release["draft"]}), flush=True)
        return
    assets = {}
    page = 1
    while True:
        batch = checked_json(session.get(f"{base}/releases/{release['id']}/assets", params={"per_page": 100, "page": page}, timeout=60))
        assets.update({item["name"]: item for item in batch})
        if len(batch) < 100:
            break
        page += 1
    verified = []
    verified_by_name = {}
    for item in pending_files():
        if item["name"] in verified_by_name:
            if verified_by_name[item["name"]]["digest"] != "sha256:" + item["sha256"]:
                raise RuntimeError("A sealed part changed after upload.")
            continue
        path = directory / item["name"]
        if path.stat().st_size != item["bytes"] or sha256_file(path) != item["sha256"]:
            raise RuntimeError(f"Local asset changed: {item['name']}")
        asset = assets.get(item["name"])
        if asset is not None and asset.get("state") == "starter":
            # Remove only this transfer's unfinished upload stub, never completed data.
            response = session.delete(f"{base}/releases/assets/{asset['id']}", timeout=60)
            if response.status_code != 204:
                raise RuntimeError("Could not clear an unfinished upload stub.")
            asset = None
        if asset is None:
            print(f"Starting upload {item['name']} ({item['bytes']:,} bytes)", flush=True)
            for attempt in range(1, 4):
                try:
                    with open(path, "rb") as stream:
                        response = session.post(release["upload_url"].split("{")[0],
                            params={"name": item["name"]},
                            headers={"Content-Type": "application/octet-stream", "Content-Length": str(item["bytes"])},
                            data=ProgressFile(stream, item["bytes"], item["name"]), timeout=(60, 180))
                    asset = checked_json(response)
                    break
                except Exception as error:
                    if attempt == 3:
                        raise RuntimeError(f"Upload failed for {item['name']}; rerun to resume. {type(error).__name__}") from None
                    # Never delete an existing asset automatically. A completed request may have lost its response.
                    batch = checked_json(session.get(f"{base}/releases/{release['id']}/assets", params={"per_page": 100}, timeout=60))
                    asset = next((row for row in batch if row["name"] == item["name"] and row["state"] == "uploaded"), None)
                    if asset is not None:
                        break
                    print(f"Retry {attempt} for {item['name']}", flush=True)
                    time.sleep(5)
        if asset.get("size") != item["bytes"] or asset.get("state") != "uploaded":
            raise RuntimeError(f"Remote size/state mismatch: {item['name']}")
        expected = "sha256:" + item["sha256"]
        if asset.get("digest") != expected:
            raise RuntimeError(f"Remote SHA256 unavailable or mismatched: {item['name']}")
        record = {"name": item["name"], "id": asset["id"], "bytes": asset["size"], "digest": asset["digest"]}
        verified.append(record)
        verified_by_name[item["name"]] = record
        assets[item["name"]] = asset
        print(f"Verified remote SHA256: {item['name']}", flush=True)
        receipt_name = f"upload-part-{args.part:04d}-receipt.json" if args.part else "upload-receipt.json"
        (directory / receipt_name).write_text(json.dumps({"release": release["html_url"], "tag": args.tag,
            "complete": False, "verified_assets": verified}, indent=2) + "\n", encoding="utf-8")
    if args.part:
        print(json.dumps({"part": args.part, "remote_sha256_verified": True}), flush=True)
        return
    release = checked_json(session.patch(f"{base}/releases/{release['id']}", json={"draft": False}, timeout=60))
    receipt = {"release": release["html_url"], "tag": args.tag, "complete": True,
               "manifest_sha256": sha256_file(manifest_path), "verified_assets": verified}
    (directory / "upload-receipt.json").write_text(json.dumps(receipt, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"release": release["html_url"], "verified_assets": len(verified), "complete": True}), flush=True)


if __name__ == "__main__":
    main()
