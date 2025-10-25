import json
from pathlib import Path
from typing import Dict, List, Set
from dataclasses import dataclass

from cc_context.core.session import SessionInfo
from cc_context.utils.path import get_snapshots_dir


@dataclass
class SessionContinuityInfo:
    session_id: str
    continued_from_parent: bool
    message_count: int
    new_messages: int
    previous_hash: str | None


def load_parent_metadata(commit_sha: str) -> Dict | None:
    snapshots_dir = get_snapshots_dir()
    metadata_file = snapshots_dir / commit_sha / "metadata.json"
    
    if not metadata_file.exists():
        return None
    
    with open(metadata_file, 'r') as f:
        return json.load(f)


def get_parent_session_ids(parent_metadata: Dict | None) -> Set[str]:
    if not parent_metadata or "sessions" not in parent_metadata:
        return set()
    
    return {s["session_id"] for s in parent_metadata["sessions"]}


def analyze_continuity(
    sessions: List[SessionInfo],
    parent_commit_sha: str | None
) -> List[SessionContinuityInfo]:
    
    parent_metadata = None
    if parent_commit_sha:
        parent_metadata = load_parent_metadata(parent_commit_sha)
    
    parent_session_ids = get_parent_session_ids(parent_metadata)
    parent_session_map = {}
    
    if parent_metadata and "sessions" in parent_metadata:
        for s in parent_metadata["sessions"]:
            parent_session_map[s["session_id"]] = s
    
    continuity_info = []
    
    for session in sessions:
        is_continued = session.session_id in parent_session_ids
        
        previous_hash = None
        new_messages = session.message_count
        
        if is_continued and session.session_id in parent_session_map:
            parent_session = parent_session_map[session.session_id]
            previous_hash = parent_session.get("file_hash")
            
            if previous_hash != session.file_hash:
                previous_count = parent_session.get("message_count", 0)
                new_messages = session.message_count - previous_count
        
        continuity_info.append(SessionContinuityInfo(
            session_id=session.session_id,
            continued_from_parent=is_continued,
            message_count=session.message_count,
            new_messages=new_messages,
            previous_hash=previous_hash
        ))
    
    return continuity_info
