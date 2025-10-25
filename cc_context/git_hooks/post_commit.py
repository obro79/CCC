#!/usr/bin/env python3
"""
Post-commit hook: Automatically commit Claude sessions to parallel git repo.

This simplified implementation uses git to manage git's problem.
After each commit in the main repo, all Claude session files are
committed to a parallel git repository inside ~/.claude/projects/{encoded-path}/
"""

import subprocess
import sys
from cc_context.core.git_ops import (
    is_claude_repo_initialized,
    add_session_files,
    commit_sessions
)


def get_current_commit_sha() -> str:
    """Get the current commit SHA from the main repository."""
    result = subprocess.run(
        ["git", "rev-parse", "HEAD"],
        capture_output=True,
        text=True,
        check=True
    )
    return result.stdout.strip()


def capture_context():
    """
    Capture Claude Code context by committing sessions to the Claude repo.

    This function:
    1. Gets the current main repo commit SHA
    2. Stages all .jsonl files in the Claude directory
    3. Commits them with a message linking to the main repo commit
    """
    # Check if Claude repo is initialized
    if not is_claude_repo_initialized():
        print("Warning: Claude repo not initialized. Run 'cc-init' to enable context capture.")
        print("Skipping context capture...")
        return

    # Get current commit SHA from main repo
    try:
        main_commit_sha = get_current_commit_sha()
    except subprocess.CalledProcessError as e:
        print(f"Error: Failed to get commit SHA: {e}", file=sys.stderr)
        return

    # Stage all session files
    if not add_session_files():
        print("Error: Failed to stage session files", file=sys.stderr)
        return

    # Commit sessions with reference to main repo commit
    if commit_sessions(main_commit_sha):
        print(f"✓ Claude sessions committed for main repo commit {main_commit_sha[:7]}")
    else:
        print("Error: Failed to commit sessions", file=sys.stderr)


def main():
    """Entry point for cc-capture command and post-commit hook."""
    try:
        capture_context()
    except Exception as e:
        print(f"Error capturing context: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        # Don't exit with error - commit is already done
        sys.exit(0)


if __name__ == "__main__":
    main()
