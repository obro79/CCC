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
- Session merging
- Metadata generation
- Session discovery

### Manual Testing Functions

You can also import and use individual test functions:

```python
from test_utils import (
    test_path_encoding,
    test_session_merge,
    test_metadata_generation,
    print_session_info,
    create_test_claude_storage
)

# Test path encoding
test_path_encoding()

# Test session merging
test_session_merge()

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

### `create_mock_session_file(session_id, message_count, base_timestamp)`
Creates a single mock session JSONL file.

```python
from test_utils import create_mock_session_file

session_file = create_mock_session_file("test-session", 20)
print(f"Created mock session: {session_file}")
```

## Development

The import errors shown by IDEs are normal - the package structure requires installation via `pip install -e .` for proper module resolution.
