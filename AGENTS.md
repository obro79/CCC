# AGENTS.md - Quick Navigation for AI Agents

This file helps AI agents efficiently navigate the codebase with minimal token usage.

## Project Overview

**Claude Code Context Manager (CCC)** - Git-integrated system that captures Claude Code conversation history at commit points.

## Where to Find Things

### Documentation
- **tech_design.md** - Comprehensive architecture, workflows, data models, and technical specs
- **supabase_schema.md** - Database schema for multi-user backend
- **README.md** - Installation, testing, and basic usage instructions

### Core Implementation
- **cc_context/** - Main Python package (see cc_context/AGENTS.md)
- **test_utils.py** - Testing utilities with real session data

### Data Directories
- **.cc-snapshots/** - Git-tracked metadata (commit-sha/metadata.json, index.json)
- **.cc-context/** - Local state tracking (gitignored, state.json)
- **.cc-contexts/** - Context storage (gitignored, context-id.jsonl files)

### External Dependencies
- **~/.claude/projects/{encoded-path}/** - Claude Code session files (session-id.jsonl)

## Quick Reference by Task

### Understanding the System
1. Read tech_design.md sections 1-2 (Executive Summary, Problem Statement)
2. Review tech_design.md section 5 (Architecture diagram)

### Understanding Data Flow
- tech_design.md section 11 (Core Workflows > Context Capture on Commit)
- See component diagram in tech_design.md section 5

### Session Merging Logic
- tech_design.md section 12 (Session Merging Algorithm)
- Implementation: cc_context/core/merger.py

### Session Continuity
- tech_design.md section 13 (Workflow 3: Session Continuity Tracking)
- Implementation: cc_context/core/continuity.py

### Path Encoding
- tech_design.md section 14 (Technical Specifications > Path Encoding)
- Implementation: cc_context/utils/path.py

### Testing
- README.md section "Testing the Package"
- Run: python test_utils.py

### Database Schema
- supabase_schema.md - Full schema for users, teams, repositories, contexts

## File Responsibilities

| File | Responsibility |
|------|----------------|
| cc_context/git_hooks/pre_commit.py | Entry point, orchestrates capture workflow |
| cc_context/core/session.py | Discovers Claude sessions, hashes files |
| cc_context/core/parser.py | Parses and validates JSONL |
| cc_context/core/merger.py | Merges multiple sessions chronologically |
| cc_context/core/continuity.py | Tracks session continuity across commits |
| cc_context/core/metadata.py | Generates metadata, updates index |
| cc_context/storage/file_storage.py | Stores contexts to filesystem |
| cc_context/utils/path.py | Path encoding utilities |

## Common Debugging Paths

### "Where are sessions discovered?"
- cc_context/core/session.py:discover_sessions()
- Uses cc_context/utils/path.py:get_claude_storage_path()

### "How are sessions merged?"
- cc_context/core/merger.py:merge_sessions()
- See tech_design.md section 12 for algorithm

### "Where is metadata stored?"
- .cc-snapshots/{commit-sha}/metadata.json (git-tracked)
- .cc-snapshots/index.json (fast lookup)
- .cc-context/state.json (local state)

### "Where is context data stored?"
- .cc-contexts/{context-id}.jsonl (local file storage)
- Future: External database via storage abstraction

## Key Data Structures

All defined in cc_context/core/ modules:

- **SessionInfo** (session.py) - Session metadata with file hash
- **Message** (parser.py) - Single conversation message
- **SessionContinuityInfo** (continuity.py) - Continuation tracking
- **Metadata format** - See tech_design.md section 3 (Data Model)

## Git Branch Structure

- **main** - Stable branch
- **backend** - Current branch, Python implementation + Supabase schema
- **frontend** - Next.js UI (separate development)

## Recent Commits (Latest First)

1. d14fd2b - Add schema to backend
2. 40da086 - Enhance README with detailed testing instructions
3. 5e3c959 - Add test utilities for real session data
4. 87fa39d - Fix path encoding and session merging
5. 230ecf3 - Add one shot implementation

## Installation & Setup

```bash
pip install -e .           # Install package
python test_utils.py       # Run all tests
```

## CLI Commands (Planned)

- cc-capture - Capture context (implemented in pre_commit.py)
- cc-status - Show context state (not implemented)
- cc-restore - Restore context (not implemented)
- cc-list - List commits with contexts (not implemented)
- cc-diff - Compare contexts (not implemented)
