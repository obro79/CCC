import subprocess
import sys

from cc_context.core.session import discover_sessions, get_parent_commit_timestamp
from cc_context.core.merger import merge_sessions
from cc_context.core.parser import messages_to_jsonl
from cc_context.core.continuity import analyze_continuity
from cc_context.core.metadata import (
    generate_context_id, create_metadata, save_metadata, 
    update_index, update_local_state
)
from cc_context.storage.file_storage import FileStorage


def get_current_commit_sha() -> str:
    result = subprocess.run(
        ["git", "rev-parse", "HEAD"],
        capture_output=True,
        text=True,
        check=True
    )
    return result.stdout.strip()


def get_parent_commit_sha() -> str | None:
    try:
        result = subprocess.run(
            ["git", "rev-parse", "HEAD^"],
            capture_output=True,
            text=True,
            check=True
        )
        return result.stdout.strip()
    except subprocess.CalledProcessError:
        return None


def is_merge_commit() -> bool:
    try:
        subprocess.run(
            ["git", "rev-parse", "--verify", "HEAD^2"],
            capture_output=True,
            check=True
        )
        return True
    except subprocess.CalledProcessError:
        return False


def get_git_author() -> str:
    try:
        result = subprocess.run(
            ["git", "config", "user.email"],
            capture_output=True,
            text=True,
            check=True
        )
        return result.stdout.strip()
    except subprocess.CalledProcessError:
        return "unknown"


def capture_context():
    if is_merge_commit():
        print("Skipping context capture: merge commit detected")
        return
    
    parent_timestamp = get_parent_commit_timestamp()
    
    sessions = discover_sessions(after_timestamp=parent_timestamp)
    
    if not sessions:
        print("No active Claude sessions found, skipping context capture")
        return
    
    print(f"Found {len(sessions)} active session(s)")
    
    merged_messages = merge_sessions(sessions)
    
    parent_commit_sha = get_parent_commit_sha()
    continuity = analyze_continuity(sessions, parent_commit_sha)
    
    context_id = generate_context_id()
    
    commit_sha = get_current_commit_sha()
    author = get_git_author()
    
    metadata = create_metadata(
        commit_sha=commit_sha,
        parent_commit=parent_commit_sha,
        context_id=context_id,
        sessions=sessions,
        continuity=continuity,
        author=author
    )
    
    jsonl_data = messages_to_jsonl(merged_messages)
    
    storage = FileStorage()
    success = storage.store_context(context_id, jsonl_data)
    
    if not success:
        print("Error: Failed to store context data", file=sys.stderr)
        return
    
    save_metadata(commit_sha, metadata)
    update_index(commit_sha, metadata)
    update_local_state(commit_sha, context_id, sessions)
    
    total_new = sum(c.new_messages for c in continuity)
    
    print(f"✓ Captured Claude context for commit {commit_sha[:7]}")
    print(f"  - {len(sessions)} session(s) merged")
    print(f"  - {metadata['total_messages']} total messages ({total_new} new since parent)")
    print(f"  - Context ID: {context_id}")


def main():
    try:
        capture_context()
    except Exception as e:
        print(f"Error capturing context: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
