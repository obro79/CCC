# Claude Code Context Manager - Supabase Schema Design

## Overview
Multi-user, team-based database schema for storing Claude Code conversation contexts with fine-grained access control.

---

## Core Tables

### Users Table
Integrates with Supabase Auth for authentication.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Teams Table
Organizations/groups that own repositories and contexts.

```sql
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,  -- URL-friendly identifier: "acme-engineering"
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Team Members Table
Many-to-many relationship with role-based access.

```sql
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('owner', 'admin', 'member')) DEFAULT 'member',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);
```

**Role Definitions:**
- `owner`: Full control (delete team, manage all settings)
- `admin`: Can invite/remove members, manage repositories
- `member`: Can read/write contexts for team repositories

### Repositories Table
Git repositories tracked within teams.

```sql
CREATE TABLE repositories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  path TEXT NOT NULL,  -- Local path or git remote URL
  name TEXT NOT NULL,  -- Display name: "my-app"
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(team_id, path)  -- Same path can exist across different teams
);
```

### Contexts Table
The core storage for Claude conversation JSONL data.

```sql
CREATE TABLE contexts (
  session_id TEXT PRIMARY KEY,  -- "ctx-550e8400"
  commit_sha TEXT NOT NULL,
  parent_commit_sha TEXT,

  -- Metadata (denormalized from .cc-snapshots/metadata.json)
  author_email TEXT,
  total_messages INTEGER,
  session_count INTEGER,
  new_messages_since_parent INTEGER,

  -- The actual conversation data
  jsonl_data TEXT NOT NULL,  -- Full JSONL string

  -- Tracking
  created_by UUID REFERENCES users(id),  -- Who captured this context
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(repository_id, commit_sha)
);
```

### Sessions Table (Optional)
Granular session tracking for analytics and debugging.

```sql
CREATE TABLE sessions (
  session_id UUID PRIMARY KEY,  -- "550e8400-e29b-41d4-a716-446655440000"
  context_id TEXT REFERENCES contexts(context_id) ON DELETE CASCADE,
  message_count INTEGER,
  new_messages INTEGER,
  continued_from_parent BOOLEAN,
  first_seen_commit TEXT,
  last_captured_commit TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Note:** Sessions table is optional. Can be added later for advanced analytics without affecting core functionality.

---

## Indexes

Performance-critical indexes for common query patterns.

```sql
-- Primary lookups
CREATE INDEX idx_contexts_context_id ON contexts(context_id);
CREATE INDEX idx_contexts_repository_id ON contexts(repository_id);
CREATE INDEX idx_contexts_commit_sha ON contexts(commit_sha);

-- Search and filtering
CREATE INDEX idx_contexts_author_email ON contexts(author_email);
CREATE INDEX idx_contexts_created_at ON contexts(created_at DESC);

-- Team membership queries
CREATE INDEX idx_team_members_user_id ON team_members(user_id);
CREATE INDEX idx_team_members_team_id ON team_members(team_id);

-- Repository lookups
CREATE INDEX idx_repositories_team_id ON repositories(team_id);

-- Session lookups (if using sessions table)
CREATE INDEX idx_sessions_context_id ON sessions(context_id);
```

---

## Row-Level Security (RLS) Policies

Supabase RLS ensures users can only access data they have permissions for.

### Enable RLS

```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE repositories ENABLE ROW LEVEL SECURITY;
ALTER TABLE contexts ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
```

### Users Policies

```sql
-- Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);
```

### Teams Policies

```sql
-- Team members can read team details
CREATE POLICY "Team members can read team"
  ON teams FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_id = teams.id
      AND user_id = auth.uid()
    )
  );

-- Team owners/admins can update team
CREATE POLICY "Team admins can update team"
  ON teams FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_id = teams.id
      AND user_id = auth.uid()
      AND role IN ('owner', 'admin')
    )
  );

-- Any authenticated user can create teams
CREATE POLICY "Users can create teams"
  ON teams FOR INSERT
  WITH CHECK (auth.uid() = created_by);
```

### Team Members Policies

```sql
-- Team members can read all memberships in their teams
CREATE POLICY "Team members can read memberships"
  ON team_members FOR SELECT
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM team_members tm
      WHERE tm.team_id = team_members.team_id
      AND tm.user_id = auth.uid()
    )
  );

-- Team admins can add members
CREATE POLICY "Team admins can add members"
  ON team_members FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_id = team_members.team_id
      AND user_id = auth.uid()
      AND role IN ('owner', 'admin')
    )
  );

-- Team admins can remove members (except owners can't be removed)
CREATE POLICY "Team admins can remove members"
  ON team_members FOR DELETE
  USING (
    role != 'owner' AND
    EXISTS (
      SELECT 1 FROM team_members tm
      WHERE tm.team_id = team_members.team_id
      AND tm.user_id = auth.uid()
      AND tm.role IN ('owner', 'admin')
    )
  );
```

### Repositories Policies

```sql
-- Team members can read repositories
CREATE POLICY "Team members can read repositories"
  ON repositories FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_id = repositories.team_id
      AND user_id = auth.uid()
    )
  );

-- Team members can create repositories
CREATE POLICY "Team members can create repositories"
  ON repositories FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_id = repositories.team_id
      AND user_id = auth.uid()
    )
  );

-- Team admins can update repositories
CREATE POLICY "Team admins can update repositories"
  ON repositories FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_id = repositories.team_id
      AND user_id = auth.uid()
      AND role IN ('owner', 'admin')
    )
  );
```

### Contexts Policies

```sql
-- Team members can read contexts for their team's repositories
CREATE POLICY "Team members can read contexts"
  ON contexts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM repositories r
      JOIN team_members tm ON tm.team_id = r.team_id
      WHERE r.id = contexts.repository_id
      AND tm.user_id = auth.uid()
    )
  );

-- Team members can insert contexts
CREATE POLICY "Team members can insert contexts"
  ON contexts FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM repositories r
      JOIN team_members tm ON tm.team_id = r.team_id
      WHERE r.id = repository_id
      AND tm.user_id = auth.uid()
    )
  );

-- Contexts are immutable (no UPDATE or DELETE in MVP)
-- If needed later, only allow creators or admins to delete
```

### Sessions Policies

```sql
-- Team members can read sessions for contexts they have access to
CREATE POLICY "Team members can read sessions"
  ON sessions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM contexts c
      JOIN repositories r ON r.id = c.repository_id
      JOIN team_members tm ON tm.team_id = r.team_id
      WHERE c.context_id = sessions.context_id
      AND tm.user_id = auth.uid()
    )
  );

-- Team members can insert sessions
CREATE POLICY "Team members can insert sessions"
  ON sessions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM contexts c
      JOIN repositories r ON r.id = c.repository_id
      JOIN team_members tm ON tm.team_id = r.team_id
      WHERE c.context_id = sessions.context_id
      AND tm.user_id = auth.uid()
    )
  );
```

---

## Design Decisions

### 1. Team Scoping
- **Rationale:** Contexts are shared within teams, not globally. This mirrors typical company/project structures.
- **Impact:** Users can be in multiple teams, each with isolated contexts.

### 2. Repository Identification
- **Strategy:** Store both local path and/or git remote URL in `path` field
- **Recommendation:** Prefer git remote URL when available, fallback to local path
- **Uniqueness:** `UNIQUE(team_id, path)` prevents duplicates within a team but allows same repo across teams

### 3. Context Storage Format
- **JSONL as TEXT blob:** Matches original design doc, simple store/fetch
- **Metadata denormalization:** Store key stats in columns for fast queries without parsing JSONL
- **Trade-off:** Some duplication between Supabase and `.cc-snapshots/metadata.json`, but enables powerful queries

### 4. Immutability
- **Contexts are immutable:** Once captured, they don't change (matches git commit philosophy)
- **No UPDATE policy:** If needed, create new context with incremental ID
- **Deletion:** Only for cleanup/admin tasks (can add later)

### 5. User Identity
- **`created_by`:** Tracks who *captured* the context (user running `git commit`)
- **`author_email`:** Tracks git commit author (may differ from `created_by`)
- **Use case:** Alice captures context for Bob's commit when pair programming

---

## Workflow Integration

### Setup Workflow

```bash
# 1. User authentication
cc-auth login
# Prompts for Supabase credentials, stores session

# 2. Create or join team
cc-team create "Acme Engineering"
# Creates team record, adds user as owner

cc-team invite bob@acme.com --role admin
# Sends invitation (future: email integration)

# 3. Initialize repository
cd /path/to/my-app
cc-init --team "Acme Engineering"
# Creates repository record in Supabase
# Links current repo to team
```

### Capture Workflow (Updated)

```
User: git commit -m "Add auth"
  ↓
pre-commit hook triggers
  ↓
1. Read local .cc-context/config.json for team/repo IDs
2. Discover active Claude sessions (unchanged)
3. Merge sessions into JSONL (unchanged)
4. Generate context_id
5. Prepare metadata
6. Call Supabase API:
   INSERT INTO contexts (
     context_id,
     repository_id,
     commit_sha,
     jsonl_data,
     ...metadata...
   )
7. RLS validates user is team member
8. Write .cc-snapshots/metadata.json (unchanged)
```

### Restore Workflow (Updated)

```
User: git checkout feature-branch
User: cc-restore

  ↓
1. Read .cc-snapshots/{commit-sha}/metadata.json
2. Extract context_id
3. Call Supabase API:
   SELECT jsonl_data FROM contexts
   WHERE context_id = 'ctx-550e8400'
4. RLS validates user is team member
5. Create new local session (unchanged)
6. Display resume command
```

---

## New CLI Commands

### Authentication

```bash
cc-auth login               # Login to Supabase
cc-auth logout              # Clear session
cc-auth whoami              # Show current user
```

### Team Management

```bash
cc-team create <name>                    # Create new team
cc-team list                             # List your teams
cc-team switch <team-slug>               # Set active team
cc-team invite <email> [--role admin]    # Invite member
cc-team remove <email>                   # Remove member
cc-team members                          # List team members
```

### Repository Management

```bash
cc-repo init --team <team-slug>     # Link current repo to team
cc-repo list                        # List team repositories
cc-repo unlink                      # Unlink current repo
cc-repo info                        # Show current repo config
```

### Context Commands (Updated)

```bash
cc-status              # Show local + team context state
cc-restore [commit]    # Restore context from team database
cc-list                # List team contexts (with filters)
cc-diff A B            # Compare contexts
```

---

## Open Questions & Decisions Needed

### 1. Repository Path Strategy

**Options:**
- **A) Local filesystem path:** `/Users/alice/my-app`
  - Pros: Simple, works offline
  - Cons: Breaks when team members have different paths

- **B) Git remote URL:** `github.com/acme/my-app`
  - Pros: Portable across team members
  - Cons: Requires git remote, fails for local-only repos

- **C) Hybrid:** Prefer remote URL, fallback to path
  - Pros: Best of both worlds
  - Cons: More complex matching logic

**Recommendation:** Option C - store both, prefer remote URL for matching

---

### 2. Public Contexts

Should contexts be shareable outside teams?

**Options:**
- **Private only:** All contexts require team membership
- **Optional public:** Add `is_public` boolean flag for shareable links
- **Public by default:** Anyone can view (bad for security)

**Recommendation:** Private only for MVP, add public sharing post-MVP

---

### 3. Context Size Limits

Supabase TEXT columns support ~1GB, but practical limits differ.

**Considerations:**
- Large contexts slow down queries
- Network transfer time for restoration
- Claude has context window limits (~200k tokens = ~10MB JSONL)

**Recommendations:**
- Warn at 10MB during capture
- Hard limit at 50MB (prevents accidents)
- Post-MVP: Implement compression (gzip) or chunking

---

### 4. Session Table - Keep or Remove?

The `sessions` table duplicates data from `metadata.json`.

**Keep if:**
- You want fast queries like "show all contexts using session X"
- You want analytics (average session length, continuation rates)
- You want to track sessions independently of contexts

**Remove if:**
- You prefer simpler schema
- You're okay parsing metadata.json for session details
- You want to minimize storage

**Recommendation:** Remove for MVP, add in Phase 5 if analytics are needed

---

### 5. Offline Support

What happens when Supabase is unreachable?

**Options:**
- **Fail fast:** pre-commit hook fails, blocks commit
- **Graceful degradation:** Write to local queue, sync later
- **Hybrid:** Store locally + sync in background

**Recommendation:** Fail fast for MVP (simpler), add queue post-MVP

---

### 6. Migration from MVP

If you started with local SQLite database, how to migrate to Supabase?

**Migration script needed:**
```bash
cc-migrate to-supabase --team "My Team"
# Reads local .cc-context/contexts.db
# Uploads all contexts to Supabase
# Links repository
```

---

## Database Abstraction Layer

Python interface (implementation-agnostic):

```python
from typing import Optional, List
from dataclasses import dataclass

@dataclass
class Context:
    context_id: str
    repository_id: str
    commit_sha: str
    jsonl_data: str
    # ... other fields

class DatabaseClient:
    """Abstraction over Supabase (or other backends)."""

    def store_context(self, context: Context) -> bool:
        """Store a context. Returns True on success."""
        pass

    def fetch_context(self, context_id: str) -> Optional[Context]:
        """Fetch context by ID. Returns None if not found."""
        pass

    def list_contexts(
        self,
        repository_id: Optional[str] = None,
        author_email: Optional[str] = None,
        limit: int = 50
    ) -> List[Context]:
        """List contexts with optional filters."""
        pass

    def get_repository_id(self, team_id: str, path: str) -> Optional[str]:
        """Get repository ID for team + path."""
        pass
```

---

## Security Considerations

### Sensitive Data in Conversations
- **Risk:** Users may discuss API keys, passwords, PII in Claude conversations
- **Mitigation:**
  - Add opt-out flag: `cc-init --no-capture-sensitive`
  - Scan JSONL for common patterns (API keys, emails) before upload
  - Encrypt JSONL at rest (Supabase supports encryption)

### API Keys
- **Storage:** Never store Supabase API keys in `.cc-snapshots/` (gitignored)
- **Location:** `~/.cc-context/credentials.json` (user home directory)
- **Rotation:** Support key rotation without re-initializing repos

### Team Data Leakage
- **Risk:** User leaves team but retains local copies of contexts
- **Mitigation:**
  - RLS prevents future fetches after removal
  - Local cache cleanup on team removal: `cc-team leave <team>`

---

## Performance Targets

### Capture (pre-commit hook)
- **Target:** < 2 seconds for typical context (50 messages)
- **Bottleneck:** Network upload to Supabase
- **Optimization:** Compress JSONL before upload

### Restore
- **Target:** < 5 seconds for typical context
- **Bottleneck:** Network download + local file write
- **Optimization:** Parallel download + unzip

### Queries (cc-list)
- **Target:** < 1 second for listing 100 contexts
- **Optimization:** Use indexes, paginate results

---

## Storage Estimates

Typical context sizes:
- **Small:** 10 messages = ~5KB JSONL
- **Medium:** 50 messages = ~25KB JSONL
- **Large:** 200 messages = ~100KB JSONL
- **Huge:** 1000 messages = ~500KB JSONL

**Supabase free tier:** 500MB database
- Can store ~10,000 medium contexts
- Sufficient for MVP and small teams

**Paid tier:** 8GB+ database
- Can store millions of contexts
- Required for large teams/enterprises

---

## Next Steps

1. **Create Supabase project**
   - Go to https://supabase.com
   - Create new project
   - Run SQL schema from this document

2. **Configure authentication**
   - Enable email/password auth
   - Or use GitHub OAuth for developer-friendly login

3. **Test RLS policies**
   - Create test users via Supabase dashboard
   - Verify policies block unauthorized access

4. **Implement database client**
   - Python client using `supabase-py`
   - Implement `store_context()` and `fetch_context()`

5. **Update workflows**
   - Modify pre-commit hook to call Supabase
   - Update `cc-restore` to fetch from Supabase

6. **Build team management CLI**
   - Implement `cc-team` commands
   - Implement `cc-auth` commands

---

## Future Enhancements

- **Context search:** Full-text search in JSONL using Supabase's `tsvector`
- **Analytics dashboard:** Web UI showing team context stats
- **Automatic cleanup:** Prune contexts older than X months
- **Conflict resolution:** Handle rare cases of duplicate context_ids
- **Audit log:** Track who accessed which contexts (compliance)
- **Export:** Bulk export team contexts for archival
- **Webhooks:** Notify Slack/Discord when contexts captured
- **AI analysis:** Summarize conversations, extract key decisions

---

## Conclusion

This schema provides a solid foundation for multi-user, team-based Claude context management. Key features:

✅ Team-based collaboration with role-based access
✅ Fine-grained security via RLS
✅ Scalable to large teams and repositories
✅ Fast queries with proper indexing
✅ Simple enough for hackathon MVP
✅ Extensible for future features

The design balances simplicity (for fast implementation) with flexibility (for future growth). Start with core tables (users, teams, repositories, contexts) and add sessions/analytics later as needed.
