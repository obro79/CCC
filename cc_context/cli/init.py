#!/usr/bin/env python3
"""
cc-init: Initialize Claude sessions directory as a git repository.

This command sets up the parallel git repository inside
~/.claude/projects/{encoded-path}/ that will track session files.
"""

import sys
from pathlib import Path
from cc_context.core.git_ops import (
    get_claude_repo_path,
    is_claude_repo_initialized,
    init_claude_repo
)
from cc_context.utils.path import get_repo_root


def init():
    """Initialize the Claude sessions directory as a git repository."""
    try:
        # Verify we're in a git repository
        repo_root = get_repo_root()
        print(f"Main repository: {repo_root}")

    except Exception as e:
        print("❌ Error: Not in a git repository", file=sys.stderr)
        print("   Run this command from inside a git repository", file=sys.stderr)
        return 1

    # Get Claude sessions path
    claude_path = get_claude_repo_path()
    print(f"Claude sessions directory: {claude_path}")

    # Check if already initialized
    if is_claude_repo_initialized():
        print()
        print("✓ Claude sessions repo is already initialized!")
        print()
        print("You can now:")
        print("  • Run 'cc-install-hook' to set up automatic capture")
        print("  • Run 'cc-capture' to manually capture current sessions")
        return 0

    # Ensure directory exists
    claude_path.mkdir(parents=True, exist_ok=True)

    # Count existing sessions
    session_files = list(claude_path.glob("*.jsonl"))
    session_count = len(session_files)

    print()
    print("Initializing Claude sessions repository...")
    print(f"Found {session_count} existing session file(s)")
    print()

    # Initialize the repo
    if not init_claude_repo():
        print("❌ Failed to initialize Claude sessions repo", file=sys.stderr)
        return 1

    print("=" * 60)
    print("🎉 Claude sessions repo initialized successfully!")
    print("=" * 60)
    print()

    if session_count > 0:
        print(f"✓ {session_count} existing session(s) committed to initial state")
        print()

    print("Next steps:")
    print("  1. Install git hooks: cc-install-hook")
    print("     This will automatically capture context after each commit")
    print()
    print("  2. Or manually capture: cc-capture")
    print("     Run this after making commits to capture context")
    print()
    print("The sessions repo location:")
    print(f"  {claude_path}")
    print()

    return 0


def main():
    """Entry point for cc-init command."""
    sys.exit(init())


if __name__ == "__main__":
    main()
