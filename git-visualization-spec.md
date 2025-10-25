# Git + Claude Context Visualization Specification

## Goal
Visualize git commits on the left (blue) with Claude conversation contexts on the right (orange), showing session continuity and branching.

## Visual Layout

```
Git (Blue)                                  Claude (Orange)

 ○  abc123d (commit 1)
 ├──────────────────────────────────────> ○  10 msgs (new_session: true - branch out)
 │                                         │
 ○  def456a (commit 2)                     │
 │                                         ○  8 msgs (new_session: false - vertical)
 │                                         │
 ○  789012d (commit 3)                     │
 │                                         ○  5 msgs (new_session: false - vertical)
 │ <───────────────────────────────────────┘ (merge back to git)
 │
 ○  012345a (commit 4)
 ├──────────────────────────────────────> ○  6 msgs (new_session: true - NEW branch out)
 │                                         │
 ○  345678d (commit 5)                     │
 │                                         ○  4 msgs (new_session: false - vertical)
 │ <───────────────────────────────────────┘ (merge back)
 │
 ○  678901a (commit 6)
 ├──────────────────────────────────────> ○  4 msgs (new_session: true - NEW branch)
 │ <───────────────────────────────────────┘ (merge back immediately)
 │
 ○  901234d (commit 7 - no context)
```

## Session Structure

### Session 1: Commits 1→2→3
- **Commit 1**: Branch out from git → Claude (new_session: true)
- **Commit 2**: Vertical connection (new_session: false - continues session 1)
- **Commit 3**: Vertical connection (new_session: false - continues session 1)
- **After Commit 3**: Merge back to git

### Session 2: Commits 4→5
- **Commit 4**: Branch out from git → Claude (new_session: true - NEW session)
- **Commit 5**: Vertical connection (new_session: false - continues session 2)
- **After Commit 5**: Merge back to git

### Session 3: Commit 6
- **Commit 6**: Branch out from git → Claude (new_session: true - NEW session)
- **After Commit 6**: Merge back immediately (session ends)

### Commit 7
- No Claude context (just git commit)

## Key Behaviors

1. **new_session: true** → Horizontal branch FROM git node TO Claude node
2. **new_session: false** → Vertical line connecting Claude nodes (continues session)
3. **Session End** → Merge line FROM Claude back TO git node
4. **Session End Detection**:
   - Next commit is new_session: true, OR
   - No more commits, OR
   - Next commit has no Claude context

## Visual Details

- Git timeline: Blue vertical line on left
- Claude timeline: Orange nodes on right (when contexts exist)
- Claude nodes sit ~10-15px BELOW their corresponding git commits (slight vertical offset)
- Horizontal branches: Bezier curve from git → claude (curving down)
- Vertical connections: Straight orange line between Claude nodes
- Merge lines: Bezier curve from claude → git
- All connection lines: Orange (#f97316)
- All git nodes/lines: Blue (#3b82f6)

## Data Structure

Each commit needs:
```typescript
{
  commit_sha: string
  total_messages: number  // 0 = no Claude context
  new_session: boolean    // true = branch out, false = vertical continuation
  // ... other fields
}
```

## Mock Data Pattern (Option B)

- Commit 1: 10 messages, new_session: true
- Commit 2: 8 messages, new_session: false
- Commit 3: 5 messages, new_session: false
- Commit 4: 6 messages, new_session: true
- Commit 5: 4 messages, new_session: false
- Commit 6: 4 messages, new_session: true
- Commit 7: 0 messages (no context)

This creates a realistic scenario showing:
- Extended session (3 commits)
- Medium session (2 commits)
- Short session (1 commit)
- Commit without Claude context
