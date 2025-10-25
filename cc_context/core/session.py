import os
import hashlib
from pathlib import Path
from typing import List
from datetime import datetime
from dataclasses import dataclass

from cc_context.utils.path import get_claude_storage_path, get_repo_root


@dataclass
class SessionInfo:
    session_id: str
    file_path: Path
    modified_time: float
    file_hash: str
    message_count: int = 0


def hash_file(file_path: Path) -> str:
    sha256 = hashlib.sha256()
    with open(file_path, 'rb') as f:
        for chunk in iter(lambda: f.read(4096), b''):
            sha256.update(chunk)
    return sha256.hexdigest()


def discover_sessions(repo_path: Path | None = None, after_timestamp: float | None = None) -> List[SessionInfo]:
    if repo_path is None:
        repo_path = get_repo_root()
    
    claude_storage = get_claude_storage_path(str(repo_path))
    
    if not claude_storage.exists():
        return []
    
    sessions = []
    
    for jsonl_file in claude_storage.glob("*.jsonl"):
        stat = jsonl_file.stat()
        modified_time = stat.st_mtime
        
        if after_timestamp is not None and modified_time <= after_timestamp:
            continue
        
        session_id = jsonl_file.stem
        file_hash = hash_file(jsonl_file)
        
        sessions.append(SessionInfo(
            session_id=session_id,
            file_path=jsonl_file,
            modified_time=modified_time,
            file_hash=file_hash
        ))
    
    sessions.sort(key=lambda s: s.modified_time)
    
    return sessions


def get_parent_commit_timestamp() -> float | None:
    import subprocess
    try:
        result = subprocess.run(
            ["git", "log", "-1", "--format=%ct", "HEAD"],
            capture_output=True,
            text=True,
            check=True
        )
        return float(result.stdout.strip())
    except (subprocess.CalledProcessError, ValueError):
        return None
