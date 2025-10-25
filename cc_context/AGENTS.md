# cc_context Package - Agent Navigation Guide

Quick reference for navigating the cc_context Python package.

## Package Structure

```
cc_context/
├── __init__.py              # Version: 0.1.0
├── core/                    # Core business logic
│   ├── session.py           # Session discovery, file hashing
│   ├── parser.py            # JSONL parsing, validation
│   ├── merger.py            # Multi-session merging
│   ├── continuity.py        # Session continuity tracking
│   └── metadata.py          # Metadata generation, index updates
├── storage/                 # Storage abstraction
│   ├── base.py              # ContextStorage ABC
│   └── file_storage.py      # FileStorage implementation
├── utils/                   # Utilities
│   └── path.py              # Path encoding, directory resolution
├── git_hooks/               # Git integration
│   └── pre_commit.py        # Main entry point (cc-capture)
└── cli/                     # Future CLI commands
    └── __init__.py
```

## Module Responsibilities

### core/session.py
**Purpose:** Session discovery and change detection

**Key Functions:**
- `discover_sessions(repo_path, after_timestamp)` - Find Claude sessions modified after timestamp
- `hash_file(file_path)` - SHA-256 hash of JSONL file

**Data Structures:**
- `SessionInfo` - Dataclass with session_id, file_path, modified_time, file_hash, message_count

**Dependencies:**
- utils/path.py for Claude storage path resolution
- core/parser.py for message counting

### core/parser.py
**Purpose:** JSONL parsing and validation

**Key Functions:**
- `parse_session_file(file_path)` - Parse JSONL, return list of Messages
- `validate_messages(messages)` - Check for duplicate UUIDs, monotonic timestamps
- `messages_to_jsonl(messages)` - Convert Message objects back to JSONL string

**Data Structures:**
- `Message` - Dataclass with type, content, timestamp, uuid, parentUuid, metadata

**Error Handling:**
- Gracefully handles corrupted JSONL lines
- Validates message integrity

### core/merger.py
**Purpose:** Multi-session chronological merging

**Key Functions:**
- `merge_sessions(sessions)` - Merge multiple SessionInfo objects chronologically
- `insert_session_boundaries(messages, session_id)` - Add "--- USER STARTED NEW SESSION ---" markers
- `relink_parent_uuids(messages)` - Create unified conversation thread

**Algorithm:**
1. Load all sessions
2. Sort by timestamp
3. Insert boundary markers
4. Relink parentUuid fields
5. Validate ordering

**Returns:** Merged message list + statistics

### core/continuity.py
**Purpose:** Detect session continuity across commits

**Key Functions:**
- `analyze_session_continuity(session, parent_metadata)` - Check if session continued from parent
- `get_new_message_count(session, parent_session_info)` - Count new messages by comparing hashes

**Data Structures:**
- `SessionContinuityInfo` - Dataclass with continued_from_parent, new_message_count

**Logic:**
- Compares current session_id with parent commit metadata
- Uses file hashes to detect changes

### core/metadata.py
**Purpose:** Metadata generation and storage

**Key Functions:**
- `generate_context_id()` - Create ctx-{uuid-prefix} ID
- `create_metadata(commit_sha, parent_sha, context_id, sessions, continuity_info)` - Generate metadata dict
- `save_metadata(snapshots_dir, commit_sha, metadata)` - Save to .cc-snapshots/{commit}/metadata.json
- `update_index(snapshots_dir, commit_sha, metadata)` - Update index.json
- `update_local_state(context_dir, commit_sha, context_id, sessions)` - Update state.json

**File Paths:**
- .cc-snapshots/{commit-sha}/metadata.json
- .cc-snapshots/index.json
- .cc-context/state.json

### storage/base.py
**Purpose:** Storage abstraction interface

**Abstract Class:**
- `ContextStorage` - ABC with methods:
  - `store_context(context_id, jsonl_data)` - Store context data
  - `fetch_context(context_id)` - Retrieve context data
  - `context_exists(context_id)` - Check existence

**Design:** Allows pluggable storage backends (file, database, cloud)

### storage/file_storage.py
**Purpose:** Local filesystem storage implementation

**Class:** `FileStorage(ContextStorage)`

**Methods:**
- `store_context(context_id, jsonl_data)` - Save to .cc-contexts/{context-id}.jsonl
- `fetch_context(context_id)` - Read from .cc-contexts/{context-id}.jsonl
- `context_exists(context_id)` - Check file existence

**Storage Path:** .cc-contexts/ (gitignored)

### utils/path.py
**Purpose:** Path utilities for cross-platform compatibility

**Key Functions:**
- `encode_path(path)` - Replace `/` with `-`, strip leading `-`
- `get_claude_storage_path(repo_path)` - Resolve ~/.claude/projects/{encoded-path}/
- `get_repo_root(path)` - Find git repository root
- `get_snapshots_dir(repo_path)` - Get .cc-snapshots directory
- `get_context_dir(repo_path)` - Get .cc-context directory
- `get_contexts_storage_dir(repo_path)` - Get .cc-contexts directory

**Path Encoding Example:**
- `/home/alice/my-app` → `home-alice-my-app`

### git_hooks/pre_commit.py
**Purpose:** Main orchestrator, git pre-commit hook entry point

**Entry Point:** `main()` function, callable via `cc-capture` command

**Workflow:**
1. Get current commit SHA and parent
2. Skip if merge commit
3. Discover sessions modified since parent
4. Parse sessions
5. Merge chronologically
6. Analyze continuity
7. Generate metadata
8. Store context
9. Update index and state
10. Print capture summary

**Console Output:**
```
✓ Captured Claude context for commit abc123d
  - 2 sessions merged
  - 61 total messages (35 new since parent)
  - Context ID: ctx-550e8400
```

## Data Flow

```
main() (pre_commit.py)
    ↓
discover_sessions() (session.py)
    ↓
parse_session_file() (parser.py)
    ↓
merge_sessions() (merger.py)
    ↓
analyze_session_continuity() (continuity.py)
    ↓
generate_context_id() (metadata.py)
    ↓
store_context() (file_storage.py)
    ↓
save_metadata() (metadata.py)
    ↓
update_index() (metadata.py)
    ↓
update_local_state() (metadata.py)
```

## Key Algorithms

### Session Discovery (session.py)
1. Encode repository path
2. Find ~/.claude/projects/{encoded-path}/
3. List all .jsonl files
4. Filter by modified time > parent_commit_timestamp
5. Return sorted by modification time

### Session Merging (merger.py)
1. Parse all session JSONL files
2. Combine messages into single list
3. Sort by timestamp
4. Insert boundary markers between sessions
5. Relink parentUuid to previous message
6. Validate chronological order

### Continuity Detection (continuity.py)
1. Load parent commit metadata
2. Check if session_id exists in parent
3. If exists: compare file hashes, count new messages
4. If not: mark as fresh session
5. Return SessionContinuityInfo

## Testing

**Test file:** ../test_utils.py (repository root)

**Key test functions:**
- `test_path_encoding()` - Verify path encoding
- `test_session_merge()` - Test with mock data
- `test_session_merge_real()` - Test with real Claude sessions
- `test_restore_merged_session()` - Create resumable session
- `test_metadata_generation()` - Validate metadata

## Type Hints

All modules use full Python type hints (Python 3.9+ union syntax: `X | None`)

## Dependencies

**External:** None (only Python standard library)

**Standard library imports:**
- json - JSON parsing
- pathlib - Cross-platform paths
- hashlib - SHA-256 hashing
- subprocess - Git commands
- datetime - Timestamps
- dataclasses - Data structures
- abc - Abstract base classes

## Common Code Patterns

### Reading JSONL
```python
with open(file_path) as f:
    for line in f:
        try:
            msg = json.loads(line)
        except json.JSONDecodeError:
            continue  # Skip corrupted lines
```

### Encoding Paths
```python
from cc_context.utils.path import encode_path
encoded = encode_path("/home/alice/my-app")  # "home-alice-my-app"
```

### Discovering Sessions
```python
from cc_context.core.session import discover_sessions
from pathlib import Path

sessions = discover_sessions(Path.cwd(), after_timestamp=1234567890)
```

### Storage Abstraction
```python
from cc_context.storage.file_storage import FileStorage

storage = FileStorage(repo_path)
storage.store_context("ctx-550e8400", jsonl_data)
```

## Future Enhancements

### cli/ directory (planned)
- cc-status - Show current context state
- cc-restore - Restore historical context
- cc-list - List commits with contexts
- cc-diff - Compare contexts between commits

### storage/ directory (future)
- database_storage.py - Database backend
- cloud_storage.py - Cloud storage backend

## Debugging Tips

### "Session not found"
- Check path encoding: utils/path.py:encode_path()
- Verify Claude storage: ~/.claude/projects/{encoded-path}/
- Check modified time filter in session.py:discover_sessions()

### "Merge failed"
- Validate JSONL: parser.py:validate_messages()
- Check timestamps: merger.py ensures chronological order
- Review corrupted lines handling in parser.py

### "Metadata not created"
- Check .cc-snapshots/ directory exists
- Verify git commit SHA
- Review metadata.py:save_metadata()

## Version

Package version defined in __init__.py: 0.1.0
