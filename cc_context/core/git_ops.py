"""
Git operations for managing the Claude sessions repository.

This module provides git operations for the parallel git repository
inside ~/.claude/projects/{encoded-path}/ that tracks session files.
"""

import subprocess
from pathlib import Path
from cc_context.utils.path import get_claude_storage_path


def get_claude_repo_path() -> Path:
    """Get the path to the Claude sessions directory (where the git repo lives)."""
    return get_claude_storage_path()


def is_claude_repo_initialized() -> bool:
    """Check if the Claude sessions directory has been initialized as a git repo."""
    claude_path = get_claude_repo_path()
    git_dir = claude_path / ".git"
    return git_dir.exists() and git_dir.is_dir()


def init_claude_repo() -> bool:
    """
    Initialize a git repository in the Claude sessions directory.

    Returns:
        bool: True if successful, False otherwise
    """
    claude_path = get_claude_repo_path()

    # Ensure the directory exists
    claude_path.mkdir(parents=True, exist_ok=True)

    try:
        # Initialize git repo
        subprocess.run(
            ["git", "init"],
            cwd=claude_path,
            capture_output=True,
            text=True,
            check=True
        )

        # Create initial commit with all existing sessions
        session_files = list(claude_path.glob("*.jsonl"))

        if session_files:
            # Stage all .jsonl files
            subprocess.run(
                ["git", "add", "*.jsonl"],
                cwd=claude_path,
                capture_output=True,
                text=True,
                check=True
            )

            # Create initial commit
            subprocess.run(
                ["git", "commit", "-m", "Initial Claude sessions"],
                cwd=claude_path,
                capture_output=True,
                text=True,
                check=True
            )

        return True

    except subprocess.CalledProcessError as e:
        print(f"Error initializing Claude repo: {e.stderr}")
        return False


def add_session_files() -> bool:
    """
    Stage all .jsonl session files in the Claude directory.

    Returns:
        bool: True if successful, False otherwise
    """
    if not is_claude_repo_initialized():
        print("Error: Claude repo not initialized. Run 'cc-init' first.")
        return False

    claude_path = get_claude_repo_path()

    try:
        subprocess.run(
            ["git", "add", "*.jsonl"],
            cwd=claude_path,
            capture_output=True,
            text=True,
            check=True
        )
        return True

    except subprocess.CalledProcessError as e:
        print(f"Error adding session files: {e.stderr}")
        return False


def commit_sessions(main_commit_sha: str) -> bool:
    """
    Commit all staged session files with a message linking to main repo commit.

    Args:
        main_commit_sha: The commit SHA from the main repository

    Returns:
        bool: True if successful, False otherwise
    """
    if not is_claude_repo_initialized():
        print("Error: Claude repo not initialized. Run 'cc-init' first.")
        return False

    claude_path = get_claude_repo_path()

    try:
        # Check if there are changes to commit
        status_result = subprocess.run(
            ["git", "status", "--porcelain"],
            cwd=claude_path,
            capture_output=True,
            text=True,
            check=True
        )

        if not status_result.stdout.strip():
            # No changes to commit
            return True

        # Commit with message linking to main repo
        commit_message = f"Context for main repo commit {main_commit_sha}"
        subprocess.run(
            ["git", "commit", "-m", commit_message],
            cwd=claude_path,
            capture_output=True,
            text=True,
            check=True
        )
        return True

    except subprocess.CalledProcessError as e:
        print(f"Error committing sessions: {e.stderr}")
        return False


def get_current_branch() -> str | None:
    """
    Get the current branch name in the Claude repo.

    Returns:
        str | None: Branch name or None if error
    """
    if not is_claude_repo_initialized():
        return None

    claude_path = get_claude_repo_path()

    try:
        result = subprocess.run(
            ["git", "rev-parse", "--abbrev-ref", "HEAD"],
            cwd=claude_path,
            capture_output=True,
            text=True,
            check=True
        )
        return result.stdout.strip()

    except subprocess.CalledProcessError:
        return None


def get_claude_commit_sha() -> str | None:
    """
    Get the current commit SHA in the Claude repo.

    Returns:
        str | None: Commit SHA or None if error
    """
    if not is_claude_repo_initialized():
        return None

    claude_path = get_claude_repo_path()

    try:
        result = subprocess.run(
            ["git", "rev-parse", "HEAD"],
            cwd=claude_path,
            capture_output=True,
            text=True,
            check=True
        )
        return result.stdout.strip()

    except subprocess.CalledProcessError:
        return None
