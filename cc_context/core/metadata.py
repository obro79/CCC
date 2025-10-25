import json
import uuid
from pathlib import Path
from datetime import datetime
from typing import Dict, List

from cc_context.core.session import SessionInfo
from cc_context.core.continuity import SessionContinuityInfo
from cc_context.utils.path import get_snapshots_dir


def generate_context_id() -> str:
    return f"ctx-{str(uuid.uuid4())[:8]}"


def create_metadata(
    commit_sha: str,
    parent_commit: str | None,
    context_id: str,
    sessions: List[SessionInfo],
    continuity: List[SessionContinuityInfo],
    author: str | None = None
) -> Dict:
    
    session_entries = []
    total_messages = 0
    total_new_messages = 0
    
    for session, cont in zip(sessions, continuity):
        session_entries.append({
            "session_id": session.session_id,
            "message_count": cont.message_count,
            "new_messages": cont.new_messages,
            "continued_from_parent": cont.continued_from_parent,
            "file_hash": session.file_hash
        })
        total_messages += cont.message_count
        total_new_messages += cont.new_messages
    
    metadata = {
        "commit_sha": commit_sha,
        "parent_commit": parent_commit,
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "author": author or "unknown",
        "context_id": context_id,
        "sessions": session_entries,
        "total_messages": total_messages,
        "new_messages_since_parent": total_new_messages
    }
    
    return metadata


def save_metadata(commit_sha: str, metadata: Dict) -> Path:
    snapshots_dir = get_snapshots_dir()
    commit_dir = snapshots_dir / commit_sha
    commit_dir.mkdir(parents=True, exist_ok=True)
    
    metadata_file = commit_dir / "metadata.json"
    with open(metadata_file, 'w') as f:
        json.dump(metadata, f, indent=2)
    
    return metadata_file


def update_index(commit_sha: str, metadata: Dict):
    snapshots_dir = get_snapshots_dir()
    index_file = snapshots_dir / "index.json"
    
    if index_file.exists():
        with open(index_file, 'r') as f:
            index = json.load(f)
    else:
        index = {"commits": {}}
    
    index["commits"][commit_sha] = {
        "has_context": True,
        "context_id": metadata["context_id"],
        "message_count": metadata["total_messages"],
        "session_count": len(metadata["sessions"]),
        "timestamp": metadata["timestamp"]
    }
    
    with open(index_file, 'w') as f:
        json.dump(index, f, indent=2)


def update_local_state(commit_sha: str, context_id: str, sessions: List[SessionInfo]):
    from cc_context.utils.path import get_context_dir
    
    context_dir = get_context_dir()
    context_dir.mkdir(parents=True, exist_ok=True)
    
    state_file = context_dir / "state.json"
    
    if state_file.exists():
        with open(state_file, 'r') as f:
            state = json.load(f)
    else:
        state = {"last_capture": {}, "session_history": {}}
    
    state["last_capture"] = {
        "commit": commit_sha,
        "context_id": context_id,
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }
    
    for session in sessions:
        if session.session_id not in state["session_history"]:
            state["session_history"][session.session_id] = {
                "first_seen_commit": commit_sha,
                "last_captured_commit": commit_sha,
                "capture_count": 1
            }
        else:
            state["session_history"][session.session_id]["last_captured_commit"] = commit_sha
            state["session_history"][session.session_id]["capture_count"] += 1
    
    with open(state_file, 'w') as f:
        json.dump(state, f, indent=2)
