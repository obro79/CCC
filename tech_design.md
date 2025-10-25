# Claude Code Context Manager - Simplified Design

## Core Concept

Maintain the state of `~/.claude` sessions synchronized with git commits by creating a **parallel git repository** inside the Claude project directory.

## Architecture

```
Main Repository:
  repository-root/.git/
    └── hooks/
        ├── post-commit    # Commit Claude sessions
        └── post-checkout  # Sync Claude sessions

Claude Sessions (separate git repo):
  ~/.claude/projects/{encoded-path}/.git/
    └── [tracks all session .jsonl files]
```

## Key Principle

**Use git to manage git's problem.** Instead of manually tracking timestamps, hashes, and file states, let a separate git repository inside `~/.claude` handle version control of session files.

## Workflows

### On Commit (post-commit hook)

1. Navigate to `~/.claude/projects/{encoded-path}/`
2. Commit all current session files to the Claude repo
3. Link: use main repo commit SHA in Claude repo commit message

```bash
cd ~/.claude/projects/{encoded-path}/
git add *.jsonl
git commit -m "Context for main repo commit ${MAIN_COMMIT_SHA}"
```

### On Checkout (post-checkout hook)

1. **Stash uncommitted sessions** from current commit:
   ```bash
   cd ~/.claude/projects/{encoded-path}/
   git stash push -m "sessions-for-${OLD_COMMIT_SHA}"
   ```

2. **Checkout Claude repo** to match new main commit:
   ```bash
   git checkout ${NEW_COMMIT_SHA}
   ```

3. **Restore stashed sessions** for this commit (if exists):
   ```bash
   stash=$(git stash list | grep "sessions-for-${NEW_COMMIT_SHA}" | cut -d: -f1)
   git stash pop $stash  # Automatic, no user prompt
   ```

## What This Solves

✅ **Sessions survive checkouts**: Claude repo checkouts with main repo
✅ **Uncommitted work preserved**: Git stash handles temporary session states
✅ **No manual timestamp tracking**: Git handles all history automatically
✅ **Works with all git operations**: reset, rebase, cherry-pick all work
✅ **Clean uninstall**: Remove `.git` from Claude directory, all sessions remain

## Data Storage

### Main Repository
- `.git/hooks/`: Git hooks that coordinate session commits
- No session data stored in main repo

### Claude Repository
- `~/.claude/projects/{encoded-path}/.git/`: Full git history of sessions
- Tracks all `.jsonl` files
- Stashes hold uncommitted sessions per commit

## Edge Cases

| Scenario | Behavior |
|----------|----------|
| No sessions on commit | Empty commit in Claude repo (or skip) |
| Never return to commit A | Stash remains (cleaned on uninstall) |
| Multiple repo clones | Each has own Claude repo (no interference) |
| Corrupted session file | Git tracks corruption (user handles) |

## Benefits Over Manual Tracking

- No timestamp comparison logic needed
- No hash computation needed
- No manual file copying/deletion
- Git's conflict resolution for free
- Standard git tools work (log, diff, blame)
- Proven reliability of git

## Installation

```bash
# Initialize Claude repo
cd ~/.claude/projects/{encoded-path}/
git init
git add *.jsonl
git commit -m "Initial Claude sessions"

# Install hooks in main repo
cc-install-hooks
```

## Uninstallation

```bash
# Option 1: Keep all sessions
cd ~/.claude/projects/{encoded-path}/
rm -rf .git

# Option 2: Restore all historical sessions
git log --all --oneline  # Review history
git checkout <any-commit>  # Get sessions from any point
rm -rf .git
```

## Why This Design Works

Git already solves the problem of "track file history and restore previous states." By using git recursively (git repo managing another git repo), we get all of git's battle-tested features for free instead of reimplementing them manually.
