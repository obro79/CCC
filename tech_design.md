# Claude Code Context Manager - MVP Design Document

## Executive Summary
Git-integrated system that captures Claude Code conversation history at commit points and enables restoration when checking out historical commits. Conversations are version-controlled artifacts that travel alongside code changes.

**Core Principle:** "Git handles branching, we handle snapshots between commits A → B"

---

## Problem Statement

### Pain Points
- Claude Code conversations lost when terminals close
- No way to understand AI reasoning behind code changes
- Team members cannot reproduce context that generated PR code
- Switching branches loses conversation continuity

### User Stories
- **Context switching:** "I committed my auth work and switched branches. When I come back, I want that Claude conversation."
- **Code review:** "This PR has AI code. Show me what the developer asked Claude."
- **Recovery:** "My terminal crashed. I want my last committed Claude context back."

---

## Architecture

### Storage Structure
```
repository-root/
├── .git/
│   └── hooks/
│       ├── post-commit          # Captures context after commit
│       └── post-checkout        # Notifies context available
│
├── .cc-snapshots/               # Git-tracked metadata only
│   ├── commit-abc123/
│   │   └── metadata.json        # Context reference + metadata
│   └── index.json               # Fast lookup table
│
└── .cc-context/                 # Gitignored
    └── state.json               # Local state tracking
```

**Note:** Actual conversation data (JSONL) stored in external database, not in repository.

### Components

```
┌─────────────────────────────────────────────┐
│  Git Repository                             │
│  ├── .cc-snapshots/    (metadata only)      │
│  └── .cc-context/      (local state)        │
└─────────────────────────────────────────────┘
         ▲                    │
         │                    ▼
    ┌─────────────────────────────────┐
    │  External Database              │
    │  (context.jsonl storage)        │
    └─────────────────────────────────┘
         ▲                    │
         │                    ▼
┌──────────────────────────────────────────┐
│  Claude Code Storage                     │
│  ~/.claude/projects/{encoded-path}/      │
│  ├── session-uuid-1.jsonl                │
│  └── session-uuid-2.jsonl                │
└──────────────────────────────────────────┘
```

---

## Data Model

### Metadata (in repository)
**Stored in:** `.cc-snapshots/{commit-sha}/metadata.json`

```json
{
  "commit_sha": "abc123def456",
  "parent_commit": "parent789",
  "timestamp": "2025-01-20T15:30:00Z",
  "author": "alice@example.com",
  
  "context_id": "ctx-550e8400",
  
  "sessions": [
    {
      "session_id": "550e8400-e29b-41d4-a716-446655440000",
      "message_count": 45,
      "new_messages": 20,
      "continued_from_parent": true
    },
    {
      "session_id": "660e8400-e29b-41d4-a716-446655440001",
      "message_count": 15,
      "new_messages": 15,
      "continued_from_parent": false
    }
  ],
  
  "total_messages": 61,
  "new_messages_since_parent": 35
}
```

### Index (in repository)
**Stored in:** `.cc-snapshots/index.json`

```json
{
  "commits": {
    "abc123def456": {
      "has_context": true,
      "context_id": "ctx-550e8400",
      "message_count": 61,
      "session_count": 2,
      "timestamp": "2025-01-20T15:30:00Z"
    },
    "merge-commit-sha": {
      "has_context": false,
      "is_merge": true,
      "reason": "context_reset_on_merge"
    }
  }
}
```

### State Tracking (local only)
**Stored in:** `.cc-context/state.json` (gitignored)

```json
{
  "last_capture": {
    "commit": "abc123def456",
    "context_id": "ctx-550e8400",
    "timestamp": "2025-01-20T15:30:00Z"
  },
  "session_history": {
    "550e8400-e29b-41d4-a716-446655440000": {
      "first_seen_commit": "parent789",
      "last_captured_commit": "abc123def456",
      "capture_count": 3
    }
  }
}
```

### Context Data (external database)
**Storage:** External database (implementation-agnostic)

**Key:** `context_id` (e.g., `ctx-550e8400`)

**Value:** JSONL format - merged, chronologically-ordered conversation

**Structure:**
```jsonl
{"type":"user","content":"Implement auth","timestamp":"14:00:00","uuid":"a1","parentUuid":null}
{"type":"assistant","content":"I'll help...","timestamp":"14:00:05","uuid":"a2","parentUuid":"a1"}
{"type":"system","content":"--- USER STARTED NEW SESSION (session-2) ---","timestamp":"14:20:00","uuid":"b0","parentUuid":"a30"}
{"type":"user","content":"Add logging","timestamp":"14:20:10","uuid":"b1","parentUuid":"b0"}
```

Claude stores session history in a .claude/-{cwd}-{repo_name}/{session_id}.jsonl
Every commit, this should track the current hash of all the session jsonl files in that project. Also on every commit, it should find which jsonl files hash has changed since the last commit, and append all the changed jsonl (chronologically) to one context file, and link that context file to the git commit.

Therefore, for every commit, there will be 0 or 1 claude context files which are associated with that commit.


---

## Core Workflows

### Workflow 1: Context Capture on Commit

**Trigger:** Git `post-commit` hook

**Design Note:** Uses `post-commit` instead of `pre-commit` to prioritize reliability - commits always succeed even if context capture fails. The commit is already created when context is captured, ensuring git operations are never blocked.

**Steps:**

1. **Identify Commit Boundary**
   - Get parent commit SHA and timestamp
   - Define capture window: activity after parent commit

2. **Discover Active Sessions**
   - Locate `~/.claude/projects/{encoded-path}/`
   - Find all `.jsonl` files modified after parent commit timestamp

3. **Session Continuity Analysis**
   - Check if each session ID exists in parent commit's metadata
   - If exists: continued session (track delta)
   - If new: fresh session

4. **Load and Parse Sessions**
   - Parse each active session JSONL file
   - Validate integrity

5. **Merge Multiple Sessions**
   - Sort chronologically by timestamp
   - Insert system markers: `"--- USER STARTED NEW SESSION ({id}) ---"`
   - Relink `parentUuid` to create unified thread

6. **Store Context**
   - Generate `context_id`
   - **Upload JSONL to database** (abstraction layer)
   - Create metadata.json with context_id reference
   - Update index.json

**Output:**
```
✓ Captured Claude context for commit abc123d
  - 2 sessions merged
  - 61 total messages (35 new since parent)
  - Context ID: ctx-550e8400
```

---

### Workflow 2: Context Restoration on Checkout

**Trigger:** User runs `cc-restore` after `git checkout`

**Steps:**

1. **Validate Request**
   - Get current commit SHA
   - Check metadata exists in `.cc-snapshots/{commit-sha}/`

2. **Fetch Context**
   - Read `context_id` from metadata.json
   - **Download JSONL from database** (abstraction layer)

3. **Detect Active Sessions**
   - Scan `~/.claude/projects/{encoded-path}/`
   - Warn if active work exists

4. **Create New Session**
   - Generate new UUID (preserves current work)
   - Copy fetched JSONL to `~/.claude/projects/{encoded-path}/{new-uuid}.jsonl`

5. **Provide Instructions**
   - Display resume command with new session ID

**Output:**
```
✓ Context restored for commit abc123d
  - 61 messages from 2 sessions
  - Created session: 770e8400-e29b-41d4-a716-446655440002

Run: claude --resume 770e8400-e29b-41d4-a716-446655440002
```

---

### Workflow 3: Session Continuity Tracking

**Scenario A: Continued Session**
```
Commit A: session-1 (messages 1-30)
  ↓ [same terminal, continues]
Commit B: session-1 (messages 1-50)
```
- Detection: session-1 exists in Commit A metadata
- Result: `continued_from_parent: true`, `new_messages: 20`

**Scenario B: Fresh Session**
```
Commit A: session-1 (messages 1-30)
  ↓ [new terminal]
Commit B: session-2 (messages 1-15)
```
- Detection: session-2 NOT in Commit A metadata
- Result: `continued_from_parent: false`, `new_messages: 15`

**Scenario C: Mixed**
```
Commit A: session-1 (messages 1-30)
  ↓ [Terminal 1: continues session-1]
  ↓ [Terminal 2: starts session-2]
Commit B: session-1 (50 msgs) + session-2 (20 msgs)
```
- Result: 70 messages total, chronologically merged

---

### Workflow 4: Branching Behavior

**Git handles branching, we just snapshot at commits:**

```
main: A ─ B ─ C
           └─ feature: D ─ E
```

| Action | Context State |
|--------|---------------|
| `git checkout -b feature` from B | No context change (just pointer) |
| Work + commit D | Capture at D |
| `git checkout main` | No automatic restoration |
| `cc-restore` | Must explicitly restore D's context |

**Key:** No special branch logic needed. Each commit independently has/lacks context.

---

### Workflow 5: Merge Commits

**Design Decision:** Merge commits have NO context

**Behavior:**
```
main:    A ─ B ─ C ───── F (merge)
              └─ D ─ E
```

At commit F:
- Detect merge: `git rev-parse --verify HEAD^2` succeeds
- Skip context capture
- Write metadata marker:
```json
{
  "commit_sha": "F",
  "is_merge": true,
  "context_reset": true,
  "parent_commits": ["C", "E"]
}
```

**Rationale:** No conversation during merge, ambiguous which context to use, simpler to reset.

---

## Session Merging Algorithm

### Input
- Session 1: 30 messages (14:00 - 14:45)
- Session 2: 15 messages (14:20 - 14:50)

### Process

1. **Load & Concatenate**
   - Parse both JSONL files
   - Combine into single array

2. **Sort Chronologically**
   - Order by `timestamp` field

3. **Insert Boundary Markers**
   - Detect session changes (by UUID pattern)
   - Add system message: `"--- USER STARTED NEW SESSION (id) ---"`

4. **Relink Parent UUIDs**
   - First message: `parentUuid = null`
   - All others: `parentUuid = previous_message.uuid`

5. **Validate**
   - Timestamps monotonically increasing
   - Parent chain unbroken
   - Message count correct

### Output
46 messages (30 + 15 + 1 marker), single unified conversation

---

## Technical Specifications

### Path Encoding
Replace `/` with `-`, strip leading `-`
- `/home/alice/my-app` → `home-alice-my-app`

### Session ID Format
UUID v4: `550e8400-e29b-41d4-a716-446655440000`

### Timestamp Format
ISO 8601 UTC: `2025-01-20T15:30:45.123Z`

### Context ID Format
Short prefix + UUID: `ctx-{first-8-chars-of-uuid}`

### Database Abstraction
```python
# Interface (implementation-agnostic)
def store_context(context_id: str, jsonl_data: str) -> bool
def fetch_context(context_id: str) -> str
```

---

## CLI Commands

### `cc-install-hook`
Install git hooks for automatic context capture
```bash
$ cc-install-hook
✓  Installed post-commit hook at: .git/hooks/post-commit
✓  Installed post-checkout hook at: .git/hooks/post-checkout

🎉 Git hooks installed successfully!

# Force installation without prompts
$ cc-install-hook --force
```

### `cc-status`
Show current context state
```bash
$ cc-status

Current commit: abc123d
Context available: Yes (61 messages, 2 sessions)
Context ID: ctx-550e8400

Active sessions:
  - session-xyz: 42 messages (modified 5m ago)
```

### `cc-restore [commit]`
Restore context (default: current HEAD)
```bash
$ cc-restore abc123d
⚠ Active session detected: session-xyz (42 messages)
Create new session? [Y/n] y

✓ Context restored
  Run: claude --resume 770e8400-e29b-41d4-a716-446655440002
```

### `cc-list`
List commits with contexts
```bash
$ cc-list

Commits with Claude context:
  abc123d (2 days ago)  - 61 msgs, 2 sessions [ctx-550e8400]
  def456g (5 days ago)  - 42 msgs, 1 session  [ctx-660e8400]
  ghi789j (1 week ago)  - 28 msgs, 1 session  [ctx-770e8400]
```

### `cc-diff A B`
Compare contexts
```bash
$ cc-diff abc123d def456g

abc123d: 61 messages (2 sessions)
def456g: 42 messages (1 session)

Delta: +19 messages, +1 session
```

---

## Implementation Phases

### Phase 1: Core Capture (Hours 0-8)
- Git post-commit hook
- Hook installer (`cc-install-hook`)
- Session discovery (mtime-based)
- Single session capture
- JSONL parsing
- Metadata generation
- Database abstraction layer (store)

**Deliverable:** Capture single-session contexts

### Phase 2: Multi-Session Merge (Hours 8-14)
- Multiple session detection
- Chronological sorting
- Boundary marker insertion
- Parent UUID relinking

**Deliverable:** Merge multiple sessions

### Phase 3: Session Continuity (Hours 14-18)
- Parent commit analysis
- Session ID matching
- Continuation detection

**Deliverable:** Track session continuity

### Phase 4: Restoration (Hours 18-24)
- `cc-restore` command
- Database abstraction (fetch)
- Active session detection
- Safe session creation

**Deliverable:** Restore historical contexts

### Phase 5: Polish (Hours 24-36)
- `cc-status`, `cc-list`, `cc-diff` commands
- Error handling
- User documentation

**Deliverable:** Production-ready tool

### Phase 6: Demo (Hours 36-48)
- Demo repository
- Presentation materials
- Video recording

**Deliverable:** Hackathon presentation

---

## Edge Cases

| Scenario | Behavior |
|----------|----------|
| No active sessions on commit | Skip capture, log message |
| Corrupted JSONL | Skip bad lines, log warning |
| Session file disappears | Skip that session, continue |
| Very large sessions (1000+ msgs) | Capture normally (no limit in MVP) |
| Multiple restores | Each creates new session |
| Restore without checkout | Require checkout first |
| Concurrent commits | Each independent (no conflict) |

---

## Success Criteria

### Minimum Viable Demo
1. ✅ Capture context on commit (single + multiple sessions)
2. ✅ Merge sessions chronologically
3. ✅ Detect session continuity
4. ✅ Restore context on checkout
5. ✅ CLI with status, restore, list commands
6. ✅ Handle merge commits (context reset)

### Demo Script
1. Start Claude, make commits with context
2. Open multiple terminals, merge sessions
3. Switch branches, show context lost
4. Run `cc-restore`, resume conversation
5. Show `cc-list` of historical contexts

---

## Future Enhancements (Post-MVP)

- Web visualization of context graph
- Automatic restoration on checkout
- Context search/grep
- Analytics (token usage, conversation patterns)
- Conflict resolution UI for multi-user
- Cross-repository context linking
- Context compression for large conversations
- Export formats (markdown, PDF)

---

## Conclusion

This system bridges the gap between ephemeral AI conversations and permanent version control. By treating Claude contexts as first-class versioned artifacts parallel to code, developers gain:

- **Reproducibility:** Understand the "why" behind AI-generated code
- **Continuity:** Never lose productive conversations
- **Collaboration:** Share AI reasoning with team members
- **History:** Track how conversations evolved with code


