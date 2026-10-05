"""Freeze all source files into a hashed, split tar.zst; never change the corpus."""
import argparse
import hashlib
import json
import os
import tarfile
import time
from datetime import datetime, timezone
from pathlib import Path
import zstandard
from common import REPO, SOURCE, TRANSFER, sha256_file

SKIP_DIRS = {".git", "node_modules", "__pycache__", ".venv", "venv",
             "handwriting-ocr-runtime", "handwriting-model-cache"}


class SplitWriter:
    def __init__(self, directory, limit):
        self.directory, self.limit = directory, limit
        self.stream = None
        self.parts = []
        self.size = 0

    def write(self, data):
        view = memoryview(data)
        total = len(view)
        while view:
            if self.stream is None:
                self.name = f"corpus.tar.zst.part-{len(self.parts) + 1:04d}"
                self.stream = open(self.directory / self.name, "xb")
                self.digest, self.size = hashlib.sha256(), 0
            piece = view[:self.limit - self.size]
            self.stream.write(piece)
            self.digest.update(piece)
            self.size += len(piece)
            view = view[len(piece):]
            if self.size == self.limit:
                self.finish_part()
        return total

    def flush(self):
        if self.stream:
            self.stream.flush()

    def finish_part(self):
        if self.stream:
            self.stream.close()
            self.parts.append({"name": self.name, "bytes": self.size,
                               "sha256": self.digest.hexdigest()})
            print(f"Sealed {self.name}: {self.size:,} bytes", flush=True)
            self.stream = None


class HashReader:
    def __init__(self, stream):
        self.stream, self.digest = stream, hashlib.sha256()

    def read(self, size=-1):
        data = self.stream.read(size)
        self.digest.update(data)
        return data


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, default=SOURCE)
    parser.add_argument("--output", type=Path, default=TRANSFER)
    parser.add_argument("--part-mib", type=int, default=512)
    args = parser.parse_args()
    source, output = args.source.resolve(), args.output.resolve()
    prefix = source.relative_to(REPO).as_posix()
    if output == source or source in output.parents:
        raise RuntimeError("Archive output must be outside the source tree.")
    if not 1 <= args.part_mib <= 1024:
        raise RuntimeError("Parts must be at most 1 GiB.")
    output.mkdir(parents=True, exist_ok=True)
    if any(output.iterdir()):
        raise RuntimeError("Use an empty output directory; existing archives are preserved.")
    paths, excluded = [], []
    for base, directories, names in os.walk(source):
        directories.sort()
        for name in directories[:]:
            if name in SKIP_DIRS or Path(base, name).is_symlink():
                excluded.append(str(Path(base, name).relative_to(REPO)).replace("\\", "/") + "/")
                directories.remove(name)
        for name in sorted(names):
            path = Path(base, name)
            if (name.startswith(".env") and name != ".env.example") or path.is_symlink():
                excluded.append(path.relative_to(REPO).as_posix())
            else:
                paths.append(path)
    total = sum(path.stat().st_size for path in paths)
    print(f"Packing {len(paths):,} files, {total:,} bytes", flush=True)
    writer = SplitWriter(output, args.part_mib * 1024 * 1024)
    processed, last = 0, time.monotonic()
    file_manifest = output / "files.jsonl"
    with open(file_manifest, "x", encoding="utf-8", newline="\n") as records:
        with zstandard.ZstdCompressor(level=3, threads=4).stream_writer(writer, closefd=False) as compressed:
            with tarfile.open(fileobj=compressed, mode="w|", format=tarfile.PAX_FORMAT) as archive:
                for index, path in enumerate(paths, 1):
                    before = path.stat()
                    info = archive.gettarinfo(str(path), arcname=path.relative_to(REPO).as_posix())
                    if not info.isfile():
                        raise RuntimeError(f"Unexpected non-file: {info.name}")
                    with open(path, "rb") as stream:
                        reader = HashReader(stream)
                        archive.addfile(info, reader)
                    after = path.stat()
                    if (before.st_size, before.st_mtime_ns) != (after.st_size, after.st_mtime_ns):
                        raise RuntimeError(f"Source changed during packing: {info.name}")
                    records.write(json.dumps({"path": info.name, "bytes": info.size,
                                              "sha256": reader.digest.hexdigest()}, ensure_ascii=False) + "\n")
                    processed += info.size
                    if time.monotonic() - last >= 15:
                        print(f"Packed {index:,}/{len(paths):,} files; {processed:,}/{total:,} source bytes", flush=True)
                        last = time.monotonic()
    writer.finish_part()
    receipt_path = source / "private-corpus/database-receipt.json"
    receipt = json.loads(receipt_path.read_text(encoding="utf-8")) if receipt_path.exists() else None
    manifest = {"format": "sandhya-private-corpus-tar-zstd-v1", "repository": "chettyv/Sandhya",
                "created_at": datetime.now(timezone.utc).isoformat(), "source_prefix": prefix,
                "files": len(paths), "source_bytes": total, "exclusions": excluded,
                "file_manifest": {"name": file_manifest.name, "bytes": file_manifest.stat().st_size,
                                  "sha256": sha256_file(file_manifest)},
                "parts": writer.parts, "database_receipt": receipt}
    (output / "manifest.json").write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(json.dumps({"packed_files": len(paths), "source_bytes": total,
                      "archive_bytes": sum(part["bytes"] for part in writer.parts),
                      "parts": len(writer.parts), "manifest": str(output / "manifest.json")}), flush=True)


if __name__ == "__main__":
    main()
