#!/usr/bin/env python3
"""
cc-checkout-sync: Synchronize Claude sessions when checking out commits

This command is called by the post-checkout git hook to:
1. Stash uncommitted sessions from the old commit
2. Checkout Claude repo to match the new main repo commit
3. Restore stashed sessions for the new commit if they exist
"""

import sys
from cc_context.core.git_ops import (
    is_claude_repo_initialized,
    stash_sessions,
    find_commit_by_main_sha,
    get_initial_commit,
    checkout_commit,
    find_stash_by_message,
    pop_stash
)


def sync_checkout(old_sha: str, new_sha: str, checkout_type: str):
    """
    Synchronize Claude sessions repository when main repo checks out a commit.

    Args:
        old_sha: The commit SHA we're coming from
        new_sha: The commit SHA we're going to
        checkout_type: "1" for branch checkout, "0" for file checkout
    """
    # Only sync on branch checkouts
    if checkout_type != "1":
        return

    # Check if Claude repo is initialized
    if not is_claude_repo_initialized():
        print("Note: Claude sessions repo not initialized. Run 'cc-init' to enable session sync.")
        return

    print(f"Syncing Claude sessions: {old_sha[:7]} → {new_sha[:7]}")

    # Step 1: Stash uncommitted sessions with old SHA
    stash_message = f"sessions-for-{old_sha}"
    if not stash_sessions(stash_message):
        print("Warning: Failed to stash current sessions")
        # Continue anyway - we want to at least try to checkout

    # Step 2: Find Claude commit for new SHA
    claude_commit = find_commit_by_main_sha(new_sha)

    if not claude_commit:
        # No commit found for new SHA - checkout initial commit
        print(f"No sessions found for commit {new_sha[:7]}, checking out initial state")
        claude_commit = get_initial_commit()

        if not claude_commit:
            print("Error: Could not find initial commit in Claude repo")
            return

    # Step 3: Checkout the Claude commit
    if not checkout_commit(claude_commit):
        print(f"Error: Failed to checkout Claude commit {claude_commit[:7]}")
        return

    print(f"✓ Checked out Claude sessions for {new_sha[:7]}")

    # Step 4: Look for stash with new SHA and pop if exists
    stash_pattern = f"sessions-for-{new_sha}"
    stash_ref = find_stash_by_message(stash_pattern)

    if stash_ref:
        print(f"Restoring previous session state from {stash_ref}")
        if pop_stash(stash_ref):
            print(f"✓ Restored sessions from {stash_ref}")
        else:
            print(f"Warning: Failed to restore sessions from {stash_ref}")
    else:
        print("No previous session state to restore")


def main():
    """Entry point for cc-checkout-sync command."""
    if len(sys.argv) != 4:
        print("Usage: cc-checkout-sync <old_sha> <new_sha> <checkout_type>", file=sys.stderr)
        print("This command is meant to be called from a git post-checkout hook", file=sys.stderr)
        sys.exit(1)

    old_sha = sys.argv[1]
    new_sha = sys.argv[2]
    checkout_type = sys.argv[3]

    try:
        sync_checkout(old_sha, new_sha, checkout_type)
    except Exception as e:
        print(f"Error syncing checkout: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        # Don't exit with error - checkout is already done
        sys.exit(0)


if __name__ == "__main__":
    main()
