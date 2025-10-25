import os
from pathlib import Path


def encode_path(repo_path: str) -> str:
    abs_path = os.path.abspath(repo_path)
    encoded = abs_path.replace(os.sep, '-')
    if encoded.startswith('-'):
        encoded = encoded[1:]
    return encoded


def get_claude_storage_path(repo_path: str) -> Path:
    home = Path.home()
    encoded = encode_path(repo_path)
    return home / ".claude" / "projects" / encoded


def get_repo_root() -> Path:
    import subprocess
    result = subprocess.run(
        ["git", "rev-parse", "--show-toplevel"],
        capture_output=True,
        text=True,
        check=True
    )
    return Path(result.stdout.strip())


def get_snapshots_dir(repo_path: Path | None = None) -> Path:
    if repo_path is None:
        repo_path = get_repo_root()
    return repo_path / ".cc-snapshots"


def get_context_dir(repo_path: Path | None = None) -> Path:
    if repo_path is None:
        repo_path = get_repo_root()
    return repo_path / ".cc-context"
