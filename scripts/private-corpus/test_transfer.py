"""Focused round-trip, corruption and overwrite protection checks for the handoff."""
import hashlib
import io
import json
import tarfile
import tempfile
import unittest
from pathlib import Path
import zstandard
from pack import SplitWriter
from restore import extract, safe_target


class TransferTests(unittest.TestCase):
    def test_split_roundtrip_and_changed_file_protection(self):
        with tempfile.TemporaryDirectory() as temporary:
            base = Path(temporary)
            archive_dir = base / "archive"
            archive_dir.mkdir()
            destination = base / "restored"
            destination.mkdir()
            prefix = "content/_staging/raw/english/source-review-2026-10-02"
            contents = {prefix + "/sample.txt": "Śiva\r\nSource text\n".encode("utf-8"),
                        prefix + "/scan.bin": bytes(range(256)) * 32}
            writer = SplitWriter(archive_dir, 200)
            with zstandard.ZstdCompressor().stream_writer(writer, closefd=False) as compressed:
                with tarfile.open(fileobj=compressed, mode="w|") as archive:
                    for name, content in contents.items():
                        member = tarfile.TarInfo(name)
                        member.size = len(content)
                        archive.addfile(member, io.BytesIO(content))
            writer.finish_part()
            manifest = {"source_prefix": prefix, "files": len(contents), "parts": writer.parts,
                        "file_manifest": {"name": "files.jsonl"}}
            with open(archive_dir / "files.jsonl", "w", encoding="utf-8") as stream:
                for name, content in contents.items():
                    stream.write(json.dumps({"path": name, "bytes": len(content),
                                             "sha256": hashlib.sha256(content).hexdigest()}) + "\n")
            self.assertGreater(len(writer.parts), 1)
            self.assertEqual(extract(manifest, archive_dir, destination, verify_only=True), len(contents))
            self.assertEqual(list(destination.iterdir()), [])
            self.assertEqual(extract(manifest, archive_dir, destination), len(contents))
            for name, content in contents.items():
                self.assertEqual((destination / name).read_bytes(), content)
            self.assertEqual(extract(manifest, archive_dir, destination), len(contents))
            changed = destination / next(iter(contents))
            changed.write_text("my local change", encoding="utf-8")
            with self.assertRaisesRegex(RuntimeError, "Refusing to overwrite"):
                extract(manifest, archive_dir, destination)
            self.assertEqual(changed.read_text(encoding="utf-8"), "my local change")
            # A wrong source-file checksum must prevent installation of that file.
            for path in destination.rglob("*"):
                if path.is_file():
                    path.unlink()
            records = (archive_dir / "files.jsonl").read_text(encoding="utf-8").replace(
                hashlib.sha256(contents[next(iter(contents))]).hexdigest(), "0" * 64)
            (archive_dir / "files.jsonl").write_text(records, encoding="utf-8")
            with self.assertRaisesRegex(RuntimeError, "digest mismatch"):
                extract(manifest, archive_dir, destination)
            self.assertFalse(changed.exists())

    def test_unsafe_paths_rejected(self):
        with tempfile.TemporaryDirectory() as temporary:
            for name in ["../outside", "/absolute", "source/../../outside", "source/C:evil", "other/file", "source\\evil"]:
                with self.assertRaises(RuntimeError):
                    safe_target(Path(temporary), "source", name)


if __name__ == "__main__":
    unittest.main()
