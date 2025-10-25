# Claude Code Context Manager (CCC)

Git-integrated system that captures Claude Code conversation history at commit points and enables restoration when checking out historical commits.

## Installation

```bash
pip install -e .
```

## Usage

### Testing the Package

Run the test utilities to verify functionality:

```bash
python test_utils.py
```

This will test:
- Path encoding utilities
- Session merging with mock data
- Session merging with real Claude sessions
- Session restoration to new Claude sessions
- Metadata generation
- Session discovery

### Manual Testing Functions

You can also import and use individual test functions:

```python
from test_utils import (
    test_path_encoding,
    test_session_merge,
    test_session_merge_real,
    test_restore_merged_session,
    test_metadata_generation,
    print_session_info,
    create_test_claude_storage
)

# Test path encoding
test_path_encoding()

# Test session merging with mock data
test_session_merge()

# Test session merging with real Claude sessions
test_session_merge_real()

# Test restoring merged sessions to new Claude session
test_restore_merged_session()

# Test metadata generation
test_metadata_generation()

# Check current sessions
print_session_info()
```

### Capturing Context on Commit

The package can be called manually or via git pre-commit hook:

```bash
# Manual capture
cc-capture

# Or run directly
python -m cc_context.git_hooks.pre_commit
```

### Setting up Git Hook

To automatically capture context on every commit:

```bash
# Copy pre-commit hook
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
cc-capture
EOF

chmod +x .git/hooks/pre-commit
```

## Package Structure

```
cc_context/
├── core/
│   ├── session.py          # Session discovery and file hashing
│   ├── parser.py           # JSONL parsing and validation
│   ├── merger.py           # Multi-session merging algorithm
│   ├── continuity.py       # Session continuity tracking
│   └── metadata.py         # Metadata generation
├── storage/
│   ├── base.py            # Storage abstraction interface
│   └── file_storage.py    # File-based storage implementation
├── git_hooks/
│   └── pre_commit.py      # Pre-commit hook implementation
├── utils/
│   └── path.py            # Path encoding utilities
└── cli/
    └── (future CLI commands)
```

## How It Works

1. **Session Discovery**: Finds Claude Code session files in `~/.claude/projects/{encoded-path}/`
2. **Change Detection**: Hashes JSONL files to detect changes since last commit
3. **Session Merging**: Combines multiple concurrent sessions chronologically
4. **Continuity Tracking**: Detects if sessions are continued or new
5. **Metadata Storage**: Saves metadata in `.cc-snapshots/{commit-sha}/metadata.json`
6. **Context Storage**: Stores merged conversation in `.cc-contexts/{context-id}.jsonl`

## Data Storage

- **`.cc-snapshots/`**: Git-tracked metadata only
  - `{commit-sha}/metadata.json`: Context reference and session info
  - `index.json`: Fast lookup table
  
- **`.cc-context/`**: Local state (gitignored)
  - `state.json`: Session tracking state
  
- **`.cc-contexts/`**: Context data (gitignored)
  - `{context-id}.jsonl`: Merged conversation data

## Testing Utilities

### `create_test_claude_storage(repo_path, sessions)`
Creates mock Claude storage directory with test sessions.

```python
from pathlib import Path
from test_utils import create_test_claude_storage

sessions = [
    {'session_id': 'test-1', 'message_count': 10},
    {'session_id': 'test-2', 'message_count': 5}
]

storage_path = create_test_claude_storage(Path.cwd(), sessions)
print(f"Created test storage at: {storage_path}")
```

### `test_session_merge_real()`
Tests session merging using actual Claude session files from `~/.claude/projects/` instead of mock data.

```python
from test_utils import test_session_merge_real

# Test with real session data
test_session_merge_real()
```

This will:
- Discover actual sessions for the current repository
- Merge them chronologically by session modified time
- Display statistics and verify ordering
- Show sample JSONL output

### `test_restore_merged_session()`
Creates a new resumable Claude session from merged real sessions, preserving all metadata and session boundaries.

```python
from test_utils import test_restore_merged_session

# Create restored session
new_session_id = test_restore_merged_session()
print(f"New session created: {new_session_id}")
```

This will:
- Read all messages from discovered sessions
- Add session boundary markers between sessions
- Create a new session file in `.claude/projects/`
- Provide instructions to resume with `claude --resume {session-id}`

### `run_all_tests()`
Runs all test functions in sequence for comprehensive validation, including both mock and real session testing.

```python
from test_utils import run_all_tests

run_all_tests()
```

This executes: path encoding → mock session merge → real session merge → metadata generation → session info display.

### `create_mock_session_file(session_id, message_count, base_timestamp)`
Creates a single mock session JSONL file.

```python
from test_utils import create_mock_session_file

session_file = create_mock_session_file("test-session", 20)
print(f"Created mock session: {session_file}")
```

## Development

The import errors shown by IDEs are normal - the package structure requires installation via `pip install -e .` for proper module resolution.
