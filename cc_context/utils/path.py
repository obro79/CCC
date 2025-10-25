import os
from pathlib import Path


def encode_path(repo_path: str) -> str:
    abs_path = os.path.abspath(repo_path)
    encoded = abs_path.replace(os.sep, '-')
    return encoded


def get_claude_storage_path() -> Path:
    home = Path.home()
    encoded = encode_path(get_repo_root())
    return home / ".claude" / "projects" / encoded


def get_repo_root() -> Path:
    # /Users/aaryanrampal/personal/programs/ccc
    # The cwd of the git repository that you are on
    import subprocess
    result = subprocess.run(
        ["git", "rev-parse", "--show-toplevel"],
        capture_output=True,
        text=True,
        check=True
    )
    return Path(result.stdout.strip())


def get_context_dir() -> Path:
    repo_path = get_repo_root()
    return repo_path / ".cc-context"
