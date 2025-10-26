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


def has_uncommitted_changes() -> bool:
    """
    Check if the Claude repo has uncommitted changes.

    Returns:
        bool: True if there are uncommitted changes, False otherwise
    """
    if not is_claude_repo_initialized():
        return False

    claude_path = get_claude_repo_path()

    try:
        result = subprocess.run(
            ["git", "status", "--porcelain"],
            cwd=claude_path,
            capture_output=True,
            text=True,
            check=True
        )
        return bool(result.stdout.strip())

    except subprocess.CalledProcessError:
        return False


def stash_sessions(message: str) -> bool:
    """
    Create a stash with the given message (only if there are changes).

    Args:
        message: Stash message

    Returns:
        bool: True if stash created or no changes, False on error
    """
    if not is_claude_repo_initialized():
        return False

    # Only stash if there are changes
    if not has_uncommitted_changes():
        return True

    claude_path = get_claude_repo_path()

    try:
        subprocess.run(
            ["git", "stash", "push", "-m", message],
            cwd=claude_path,
            capture_output=True,
            text=True,
            check=True
        )
        return True

    except subprocess.CalledProcessError as e:
        print(f"Error stashing sessions: {e.stderr}")
        return False


def find_commit_by_main_sha(main_sha: str) -> str | None:
    """
    Find a Claude repo commit that references the given main repo SHA.

    Args:
        main_sha: The main repository commit SHA to search for

    Returns:
        str | None: Claude repo commit SHA if found, None otherwise
    """
    if not is_claude_repo_initialized():
        return None

    claude_path = get_claude_repo_path()

    try:
        # Search for commit messages containing the main SHA
        result = subprocess.run(
            ["git", "log", "--grep", main_sha, "--format=%H", "-n", "1"],
            cwd=claude_path,
            capture_output=True,
            text=True,
            check=True
        )

        commit_sha = result.stdout.strip()
        return commit_sha if commit_sha else None

    except subprocess.CalledProcessError:
        return None


def get_initial_commit() -> str | None:
    """
    Get the first (initial) commit SHA in the Claude repo.

    Returns:
        str | None: Initial commit SHA or None if error
    """
    if not is_claude_repo_initialized():
        return None

    claude_path = get_claude_repo_path()

    try:
        result = subprocess.run(
            ["git", "rev-list", "--max-parents=0", "HEAD"],
            cwd=claude_path,
            capture_output=True,
            text=True,
            check=True
        )
        return result.stdout.strip()

    except subprocess.CalledProcessError:
        return None


def checkout_commit(commit_sha: str) -> bool:
    """
    Checkout a specific commit in the Claude repo.

    Args:
        commit_sha: The commit SHA to checkout

    Returns:
        bool: True if successful, False otherwise
    """
    if not is_claude_repo_initialized():
        return False

    claude_path = get_claude_repo_path()

    try:
        subprocess.run(
            ["git", "checkout", commit_sha],
            cwd=claude_path,
            capture_output=True,
            text=True,
            check=True
        )
        return True

    except subprocess.CalledProcessError as e:
        print(f"Error checking out commit: {e.stderr}")
        return False


def find_stash_by_message(pattern: str) -> str | None:
    """
    Find a stash entry matching the given pattern.

    Args:
        pattern: Pattern to search for in stash messages

    Returns:
        str | None: Stash reference (e.g., "stash@{0}") or None if not found
    """
    if not is_claude_repo_initialized():
        return None

    claude_path = get_claude_repo_path()

    try:
        result = subprocess.run(
            ["git", "stash", "list"],
            cwd=claude_path,
            capture_output=True,
            text=True,
            check=True
        )

        # Parse stash list to find matching entry
        for line in result.stdout.strip().split('\n'):
            if pattern in line:
                # Extract stash reference (e.g., "stash@{0}")
                stash_ref = line.split(':')[0].strip()
                return stash_ref

        return None

    except subprocess.CalledProcessError:
        return None


def pop_stash(stash_ref: str) -> bool:
    """
    Pop a specific stash by reference.

    Args:
        stash_ref: Stash reference (e.g., "stash@{0}")

    Returns:
        bool: True if successful, False otherwise
    """
    if not is_claude_repo_initialized():
        return False

    claude_path = get_claude_repo_path()

    try:
        subprocess.run(
            ["git", "stash", "pop", stash_ref],
            cwd=claude_path,
            capture_output=True,
            text=True,
            check=True
        )
        return True

    except subprocess.CalledProcessError as e:
        print(f"Error popping stash: {e.stderr}")
        return False
