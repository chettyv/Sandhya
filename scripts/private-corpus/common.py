"""Private release transfer helpers. Credentials stay in memory."""
import hashlib
import os
import subprocess
from pathlib import Path

REPOSITORY = "chettyv/Sandhya"
TAG = "private-corpus-2026-10-05"
REPO = Path(__file__).resolve().parents[2]
SOURCE = REPO / "content/_staging/raw/english/source-review-2026-10-02"
TRANSFER = REPO / "content/_staging/transfer" / TAG


def sha256_file(path):
    digest = hashlib.sha256()
    with open(path, "rb") as stream:
        for block in iter(lambda: stream.read(8 * 1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def github_session():
    import requests
    environment = dict(os.environ, GIT_TERMINAL_PROMPT="0", GCM_INTERACTIVE="Never")
    result = subprocess.run(
        ["git", "credential", "fill"],
        input="protocol=https\nhost=github.com\n\n",
        text=True, capture_output=True, env=environment, timeout=30,
    )
    if result.returncode:
        raise RuntimeError("Sign into GitHub through Git Credential Manager first.")
    credential = dict(line.split("=", 1) for line in result.stdout.splitlines() if "=" in line)
    token = credential.get("password")
    if not token:
        raise RuntimeError("No GitHub credential available.")
    session = requests.Session()
    session.headers.update({"Authorization": "Bearer " + token,
                            "Accept": "application/vnd.github+json",
                            "X-GitHub-Api-Version": "2022-11-28"})
    response = session.get(f"https://api.github.com/repos/{REPOSITORY}", timeout=60)
    if response.status_code != 200 or not response.json().get("private"):
        raise RuntimeError("The authenticated destination must be the private Sandhya repository.")
    return session


def checked_json(response):
    if not response.ok:
        raise RuntimeError(f"GitHub request failed: HTTP {response.status_code}; credentials omitted.")
    return response.json()
