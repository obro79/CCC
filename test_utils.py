import json
import tempfile
import uuid
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Any


def create_mock_session_file(session_id: str, message_count: int, base_timestamp: str | None = None) -> Path:
    temp_dir = Path(tempfile.mkdtemp())
    session_file = temp_dir / f"{session_id}.jsonl"
    
    if base_timestamp is None:
        base_timestamp = datetime.utcnow().isoformat()
    
    messages = []
    for i in range(message_count):
        msg = {
            "type": "user" if i % 2 == 0 else "assistant",
            "content": f"Message {i+1} content",
            "timestamp": base_timestamp,
            "uuid": f"uuid-{session_id}-{i}",
            "parentUuid": f"uuid-{session_id}-{i-1}" if i > 0 else None
        }
        messages.append(json.dumps(msg))
    
    with open(session_file, 'w') as f:
        f.write('\n'.join(messages))
    
    return session_file


def create_test_claude_storage(repo_path: Path, sessions: List[dict]) -> Path:
    from cc_context.utils.path import encode_path
    
    home = Path.home()
    encoded = encode_path(str(repo_path))
    claude_storage = home / ".claude" / "projects" / encoded
    claude_storage.mkdir(parents=True, exist_ok=True)
    
    for session_info in sessions:
        session_id = session_info['session_id']
        message_count = session_info.get('message_count', 5)
        timestamp = session_info.get('timestamp', datetime.utcnow().isoformat())
        
        session_file = claude_storage / f"{session_id}.jsonl"
        messages = []
        
        for i in range(message_count):
            msg = {
                "type": "user" if i % 2 == 0 else "assistant",
                "content": f"Session {session_id} - Message {i+1}",
                "timestamp": timestamp,
                "uuid": f"uuid-{session_id}-{i}",
                "parentUuid": f"uuid-{session_id}-{i-1}" if i > 0 else None
            }
            messages.append(json.dumps(msg))
        
        with open(session_file, 'w') as f:
            f.write('\n'.join(messages))
    
    return claude_storage


def print_session_info():
    from cc_context.core.session import discover_sessions
    from cc_context.utils.path import get_repo_root
    
    print("\n=== Session Discovery Test ===")
    
    repo_root = get_repo_root()
    print(f"Repository root: {repo_root}")
    
    sessions = discover_sessions()
    
    if not sessions:
        print("No sessions found")
        return
    
    print(f"\nFound {len(sessions)} session(s):")
    for session in sessions:
        print(f"  - Session ID: {session.session_id}")
        print(f"    File: {session.file_path}")
        print(f"    Hash: {session.file_hash[:16]}...")
        print(f"    Modified: {datetime.fromtimestamp(session.modified_time)}")
        print()


def test_path_encoding():
    from cc_context.utils.path import encode_path, get_claude_storage_path
    
    print("\n=== Path Encoding Test ===")
    
    test_paths = [
        "/Users/test/my-app",
        "/home/user/projects/test",
        "/var/www/site"
    ]
    
    for path in test_paths:
        encoded = encode_path(path)
        claude_path = get_claude_storage_path(path)
        print(f"Original: {path}")
        print(f"Encoded:  {encoded}")
        print(f"Claude:   {claude_path}")
        print()


def test_session_merge():
    from cc_context.core.session import SessionInfo
    from cc_context.core.merger import merge_sessions
    from cc_context.core.parser import messages_to_jsonl
    
    print("\n=== Session Merge Test ===")
    
    session1_file = create_mock_session_file("session-1", 3, "2025-01-20T10:00:00")
    session2_file = create_mock_session_file("session-2", 2, "2025-01-20T10:05:00")
    
    sessions = [
        SessionInfo(
            session_id="session-1",
            file_path=session1_file,
            modified_time=session1_file.stat().st_mtime,
            file_hash="hash1"
        ),
        SessionInfo(
            session_id="session-2",
            file_path=session2_file,
            modified_time=session2_file.stat().st_mtime,
            file_hash="hash2"
        )
    ]
    
    merged = merge_sessions(sessions)
    
    print(f"Merged {len(sessions)} sessions into {len(merged)} messages")
    print("\nMerged conversation:")
    for i, msg in enumerate(merged):
        print(f"  {i+1}. [{msg.type}] {msg.content[:50]}")
    
    print("\nJSONL output:")
    jsonl = messages_to_jsonl(merged)
    print(jsonl[:200] + "...")


def test_metadata_generation():
    from cc_context.core.metadata import generate_context_id, create_metadata
    from cc_context.core.session import SessionInfo
    from cc_context.core.continuity import SessionContinuityInfo

    print("\n=== Metadata Generation Test ===")

    context_id = generate_context_id()
    print(f"Generated context ID: {context_id}")

    sessions = [
        SessionInfo(
            session_id="test-session",
            file_path=Path("/tmp/test.jsonl"),
            modified_time=0,
            file_hash="abc123"
        )
    ]

    continuity = [
        SessionContinuityInfo(
            session_id="test-session",
            continued_from_parent=False,
            message_count=10,
            new_messages=10,
            previous_hash=None
        )
    ]

    metadata = create_metadata(
        commit_sha="abc123def",
        parent_commit="parent789",
        context_id=context_id,
        sessions=sessions,
        continuity=continuity,
        author="test@example.com"
    )

    print("\nGenerated metadata:")
    print(json.dumps(metadata, indent=2))


def test_session_merge_real():
    from cc_context.core.session import discover_sessions
    from cc_context.core.merger import merge_sessions, get_message_stats
    from cc_context.core.parser import messages_to_jsonl

    print("\n=== Real Session Merge Test ===")

    # Discover actual sessions from the current repo
    sessions = discover_sessions()

    if not sessions:
        print("No real sessions found in ~/.claude/projects/")
        return

    print(f"\nFound {len(sessions)} real session(s):")
    for i, session in enumerate(sessions, 1):
        print(f"\n  {i}. Session ID: {session.session_id[:8]}...")
        print(f"     File: {session.file_path.name}")
        print(f"     Hash: {session.file_hash[:16]}...")
        print(f"     Modified: {datetime.fromtimestamp(session.modified_time)}")
        print(f"     Size: {session.file_path.stat().st_size:,} bytes")

    # Merge all sessions
    print("\n--- Merging Sessions ---")
    merged = merge_sessions(sessions)

    # Get statistics
    stats = get_message_stats(merged)

    print(f"\nMerge Results:")
    print(f"  Total messages: {stats['total_messages']}")
    print(f"  User messages: {stats['user_messages']}")
    print(f"  Assistant messages: {stats['assistant_messages']}")
    print(f"  System messages (boundaries): {stats['system_messages']}")

    # Show first few messages
    print(f"\nFirst 10 messages from merged conversation:")
    for i, msg in enumerate(merged[:10], 1):
        content_preview = msg.content[:60].replace('\n', ' ')
        if len(msg.content) > 60:
            content_preview += "..."
        print(f"  {i:2d}. [{msg.type:9s}] {content_preview}")

    if len(merged) > 10:
        print(f"  ... ({len(merged) - 10} more messages)")

    # Verify chronological ordering
    print("\n--- Verifying Chronological Order ---")
    timestamps = [msg.timestamp for msg in merged if msg.type != "system"]
    if all(timestamps[i] <= timestamps[i+1] for i in range(len(timestamps)-1)):
        print("✓ All messages are in chronological order")
    else:
        print("✗ Warning: Messages may not be in chronological order")

    # Show sample JSONL output
    print("\nSample JSONL output (first 2 messages):")
    sample_messages = merged[:2]
    for msg in sample_messages:
        print(f"  {json.dumps(msg.to_dict())}")

    print(f"\nTotal merged conversation size: {len(messages_to_jsonl(merged)):,} bytes")


def test_restore_merged_session():
    from cc_context.core.session import discover_sessions
    from cc_context.utils.path import get_claude_storage_path, get_repo_root

    print("\n=== Restore Merged Session Test ===")

    # Discover actual sessions from the current repo
    sessions = discover_sessions()

    if not sessions:
        print("No real sessions found to merge")
        return

    print(f"\nDiscovered {len(sessions)} session(s) to merge")

    # Read raw JSON messages from all sessions (preserving all metadata)
    all_messages = []
    for session in sessions:
        print(f"  Reading session: {session.session_id[:8]}...")
        with open(session.file_path, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line:
                    try:
                        msg = json.loads(line)
                        msg['_original_session_id'] = session.session_id  # Track origin
                        all_messages.append(msg)
                    except json.JSONDecodeError as e:
                        print(f"    Warning: Skipping corrupted line: {e}")

    print(f"\nLoaded {len(all_messages)} total messages from all sessions")

    # Generate new session ID
    new_session_id = str(uuid.uuid4())
    print(f"Generated new session ID: {new_session_id}")

    # Transform messages for new session
    transformed_messages = []
    prev_uuid = None
    prev_session = None

    for msg in all_messages:
        current_session = msg.get('_original_session_id')

        # Add session boundary marker when switching sessions (except first)
        if current_session != prev_session and prev_session is not None:
            boundary_msg = {
                "type": "system",
                "content": f"--- USER STARTED NEW SESSION ({current_session}) ---",
                "timestamp": msg.get('timestamp', ''),
                "uuid": f"boundary-{current_session}",
                "parentUuid": prev_uuid
            }
            transformed_messages.append(boundary_msg)
            prev_uuid = boundary_msg["uuid"]

        # Update message with new session ID and parentUuid
        new_msg = msg.copy()

        # Remove our tracking field
        new_msg.pop('_original_session_id', None)

        # Update sessionId if present
        if 'sessionId' in new_msg:
            new_msg['sessionId'] = new_session_id

        # Fix parent UUID to maintain chain
        if prev_uuid is not None:
            new_msg['parentUuid'] = prev_uuid

        transformed_messages.append(new_msg)
        prev_uuid = new_msg.get('uuid', prev_uuid)
        prev_session = current_session

    print(f"Transformed into {len(transformed_messages)} messages (including {sum(1 for m in transformed_messages if m.get('type') == 'system')} boundary markers)")

    # Write to new session file in .claude directory
    repo_root = get_repo_root()
    claude_storage = get_claude_storage_path(str(repo_root))
    claude_storage.mkdir(parents=True, exist_ok=True)

    new_session_file = claude_storage / f"{new_session_id}.jsonl"

    with open(new_session_file, 'w', encoding='utf-8') as f:
        for msg in transformed_messages:
            f.write(json.dumps(msg) + '\n')

    print(f"\n✓ Created new session file: {new_session_file}")
    print(f"  File size: {new_session_file.stat().st_size:,} bytes")

    # Print resume instructions
    print(f"\n{'='*60}")
    print("To test the restored session, run:")
    print(f"  claude --resume {new_session_id}")
    print(f"{'='*60}\n")

    return new_session_id


def run_all_tests():
    print("=" * 60)
    print("CC-CONTEXT TEST UTILITIES")
    print("=" * 60)

    test_path_encoding()
    test_session_merge()
    test_session_merge_real()
    test_metadata_generation()
    print_session_info()

    print("\n" + "=" * 60)
    print("All tests completed!")
    print("=" * 60)


if __name__ == "__main__":
    run_all_tests()
