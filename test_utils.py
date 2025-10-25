import json
import tempfile
from pathlib import Path
from datetime import datetime
from typing import List


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


def run_all_tests():
    print("=" * 60)
    print("CC-CONTEXT TEST UTILITIES")
    print("=" * 60)
    
    test_path_encoding()
    test_session_merge()
    test_metadata_generation()
    print_session_info()
    
    print("\n" + "=" * 60)
    print("All tests completed!")
    print("=" * 60)


if __name__ == "__main__":
    run_all_tests()
