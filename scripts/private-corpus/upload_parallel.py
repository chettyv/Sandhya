"""Upload three closed archive parts at a time, then verify and finalize the release."""
import argparse
import json
import subprocess
import sys
import time
from pathlib import Path
from common import TRANSFER, TAG


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--directory", type=Path, default=TRANSFER)
    parser.add_argument("--workers", type=int, default=3)
    args = parser.parse_args()
    if not 1 <= args.workers <= 4:
        raise RuntimeError("Use one to four upload workers.")
    directory = args.directory.resolve()
    uploader = Path(__file__).with_name("upload.py")
    base = [sys.executable, "-u", str(uploader), "--directory", str(directory), "--tag", TAG]
    if subprocess.run(base + ["--prepare-release"]).returncode:
        raise RuntimeError("Private release preparation failed.")
    pending, completed = {}, set()
    while True:
        manifest_path = directory / "manifest.json"
        finished_packing = manifest_path.exists()
        parts = sorted(directory.glob("corpus.tar.zst.part-*"))
        if not finished_packing:
            parts = parts[:-1]
        for path in parts:
            number = int(path.name.rsplit("-", 1)[1])
            if number in completed or number in pending:
                continue
            if (directory / f"upload-part-{number:04d}-receipt.json").exists():
                completed.add(number)
                continue
            if len(pending) < args.workers:
                pending[number] = subprocess.Popen(base + ["--part", str(number)])
        for number, process in list(pending.items()):
            code = process.poll()
            if code is not None:
                del pending[number]
                if code:
                    for remaining in pending.values():
                        remaining.terminate()
                    raise RuntimeError(f"Upload worker {number} failed. Rerun to resume verified parts.")
                completed.add(number)
                print(f"Remote-verified parts: {len(completed)}", flush=True)
        if finished_packing and not pending and len(completed) == len(parts):
            break
        time.sleep(5)
    # Re-read GitHub assets, independently check every recorded remote digest and publish only then.
    result = subprocess.run(base)
    if result.returncode:
        raise RuntimeError("Final release verification failed; verified parts remain available to resume.")


if __name__ == "__main__":
    main()
