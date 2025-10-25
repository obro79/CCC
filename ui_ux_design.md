# Claude Code Context Manager - UI/UX Implementation Plan

## Overview
Build a modern web interface for browsing, viewing, and managing Claude Code conversation contexts with team collaboration features.

## Core Pages & Features

### 1. **Authentication Flow**
- **Login Page** (`/login`)
  - Email/password or GitHub OAuth
  - Clean, centered card layout
  - "Sign up" link for new users
- **Signup Page** (`/signup`)
  - User registration form
  - Auto-create personal team on signup

### 2. **Dashboard** (`/dashboard`)
- **Hero Section**: Quick stats (total contexts, team repos, recent activity)
- **Recent Contexts**: Card grid showing latest 6-8 context captures
  - Commit SHA, timestamp, message count, author
  - Click to view full context
- **Team Selector**: Dropdown to switch active team
- **Quick Actions**: "Restore Context", "View Repositories"

### 3. **Context Browser** (`/contexts`)
- **Filters Sidebar**:
  - Repository dropdown
  - Date range picker
  - Author filter
  - Message count range slider
- **Context List**: Table/card view with:
  - Commit SHA (monospace, copyable)
  - Timestamp (relative + absolute)
  - Message count badge
  - Session count badge
  - Author avatar + name
  - Quick actions: View, Copy ID, Download JSONL
- **Pagination**: Load more / page navigation
- **Search**: Full-text search across contexts

### 4. **Context Viewer** (`/contexts/[contextId]`)
- **Header**:
  - Context ID (copyable)
  - Commit SHA with link to git provider
  - Stats: messages, sessions, timestamp
- **Conversation Display**:
  - Chat-style interface (like Claude)
  - User messages: right-aligned, blue accent
  - Assistant messages: left-aligned, neutral
  - System messages: centered, muted
  - Session boundary markers clearly visible
- **Sidebar**:
  - Metadata panel (commit info, author, etc.)
  - Session list with jump-to links
  - Download options (JSONL, Markdown, PDF future)
- **Actions**:
  - "Restore to Local" button with CLI command
  - Share link (future: public contexts)

### 5. **Context Comparison** (`/contexts/compare?a=ctx1&b=ctx2`)
- **Side-by-Side View**:
  - Two columns showing context metadata
  - Diff stats: +/- messages, sessions
  - Highlighted differences
- **Message Timeline**: Visual comparison of conversation flow
- **Export**: Generate comparison report

### 6. **Repositories** (`/repositories`)
- **Repository List**: Cards with:
  - Repo name + path/URL
  - Context count
  - Team badge
  - Last activity timestamp
- **Add Repository**: Modal for linking new repos
- **Repository Detail** (`/repositories/[repoId]`):
  - Commit history with contexts
  - Git graph visualization (future)
  - Context timeline

### 7. **Team Management** (`/teams`)
- **Team List**: All teams user belongs to
- **Active Team View**:
  - Members list with roles (owner, admin, member)
  - Invite member form
  - Role management (admins only)
  - Team settings (name, slug)
- **Create Team**: Modal with form

### 8. **Settings** (`/settings`)
- **Profile Tab**: Display name, email, avatar
- **API Keys Tab**: Supabase credentials, CLI setup
- **Preferences Tab**: Theme, notifications, defaults
- **Danger Zone**: Leave team, delete account

## Design System

### Visual Style
- **Color Palette**:
  - Neutral base (zinc/slate from Tailwind)
  - Blue accent for primary actions
  - Monospace font for code/IDs (Geist Mono)
  - Sans-serif for UI (Geist Sans)
- **Components**: shadcn/ui (New York style)
  - Cards with subtle borders
  - Buttons with hover states
  - Input fields with focus rings
  - Badges for counts/statuses

### Key Components to Build
1. **ContextCard**: Reusable card for context previews
2. **ConversationMessage**: Chat bubble component
3. **TeamBadge**: Visual team indicator
4. **CommitSHA**: Formatted, copyable commit hash
5. **StatCard**: Dashboard statistics
6. **FilterPanel**: Sidebar with filters
7. **EmptyState**: Friendly empty states with CTAs

### Layout
- **Sidebar Navigation**: Persistent left sidebar with:
  - Logo/branding
  - Dashboard, Contexts, Repositories, Teams
  - User menu at bottom
- **Header**: Top bar with:
  - Breadcrumbs
  - Team switcher
  - Search (global)
  - User avatar/menu
- **Responsive**: Mobile-friendly with hamburger menu

## Implementation Steps

### Phase 1: Foundation (Pages 1-8)
1. Set up Next.js layouts (dashboard layout with sidebar)
2. Install additional shadcn components (table, card, badge, dropdown, etc.)
3. Create base components (ContextCard, StatCard, etc.)
4. Build authentication pages with Supabase Auth

### Phase 2: Core Features (Pages 9-16)
5. Dashboard with stats and recent contexts
6. Context browser with filters and pagination
7. Context viewer with conversation display
8. Repository list and detail pages

### Phase 3: Collaboration (Pages 17-24)
9. Team management interface
10. Settings pages
11. Context comparison tool
12. Polish and empty states

### Phase 4: Integration (Pages 25-28)
13. Connect to Supabase backend
14. Implement RLS-aware queries
15. Add real-time updates (optional)
16. Testing and refinement

## Technical Considerations

### State Management
- **React Context** for auth state and active team
- **Server Components** for data fetching (Next.js 15)
- **Client Components** for interactive features

### Data Fetching
- **Supabase Client**: `@supabase/ssr` for Next.js
- **Server Actions** for mutations
- **React Query** (optional) for client-side caching

### Performance
- **Virtualization**: For long conversations (react-window)
- **Pagination**: Limit contexts per page (50-100)
- **Lazy Loading**: Images and heavy components
- **Code Splitting**: Route-based splitting (automatic in Next.js)

### Accessibility
- **Keyboard Navigation**: Full keyboard support
- **ARIA Labels**: Screen reader friendly
- **Focus Management**: Proper focus trapping in modals
- **Color Contrast**: WCAG AA compliance

## Success Metrics
- ✅ Users can browse all team contexts
- ✅ Users can view full conversations in readable format
- ✅ Users can manage team members and repositories
- ✅ Users can compare contexts side-by-side
- ✅ Mobile-responsive design
- ✅ < 3s page load time
- ✅ Accessible (WCAG AA)

## Wireframe Descriptions

### Dashboard Layout
```
┌─────────────────────────────────────────────────────┐
│ [Logo]  Dashboard                    [Team▼] [@User]│
├─────────────────────────────────────────────────────┤
│                                                       │
│  📊 Quick Stats                                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐            │
│  │  125     │ │    8     │ │   42     │            │
│  │ Contexts │ │  Repos   │ │ Members  │            │
│  └──────────┘ └──────────┘ └──────────┘            │
│                                                       │
│  Recent Contexts                      [View All →]  │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐  │
│  │ abc123d     │ │ def456g     │ │ ghi789j     │  │
│  │ 61 msgs     │ │ 42 msgs     │ │ 28 msgs     │  │
│  │ 2 days ago  │ │ 5 days ago  │ │ 1 week ago  │  │
│  └─────────────┘ └─────────────┘ └─────────────┘  │
└─────────────────────────────────────────────────────┘
```

### Context Viewer Layout
```
┌─────────────────────────────────────────────────────┐
│ Context: ctx-550e8400          [📋 Copy] [⬇ Download]│
├─────────────────────────────────────────────────────┤
│                                         ┌───────────┐│
│  💬 Conversation                        │ Metadata  ││
│  ┌──────────────────────────┐          │           ││
│  │ User: Implement auth     │          │ Commit:   ││
│  └──────────────────────────┘          │ abc123d   ││
│                                         │           ││
│         ┌────────────────────────────┐ │ Author:   ││
│         │ Assistant: I'll help...    │ │ Alice     ││
│         └────────────────────────────┘ │           ││
│                                         │ Sessions: ││
│  ─── NEW SESSION (session-2) ───       │ • sess-1  ││
│                                         │ • sess-2  ││
│  ┌──────────────────────────┐          └───────────┘│
│  │ User: Add logging        │                        │
│  └──────────────────────────┘                        │
└─────────────────────────────────────────────────────┘
```

### Context Browser Layout
```
┌─────────────────────────────────────────────────────┐
│ Contexts                              [🔍 Search]    │
├─────────────────────────────────────────────────────┤
│ Filters       │ Commit SHA    Messages  Author  Date │
│               ├─────────────────────────────────────│
│ 📁 Repository │ abc123d         61      Alice   2d  │
│ ▾ All         │ def456g         42      Bob     5d  │
│               │ ghi789j         28      Alice   7d  │
│ 📅 Date       │ jkl012m         35      Carol   9d  │
│ ○ Last week   │ ...                                 │
│ ○ Last month  │                                     │
│               │                   [← 1 2 3 4 5 →]   │
│ 👤 Author     │                                     │
│ ☐ Alice (42)  │                                     │
│ ☐ Bob (18)    │                                     │
└───────────────┴─────────────────────────────────────┘
```

## Color Scheme

### Primary Colors
- **Background**: `zinc-50` (light) / `zinc-950` (dark)
- **Card Background**: `white` (light) / `zinc-900` (dark)
- **Primary Action**: `blue-600` → `blue-700` hover
- **Text Primary**: `zinc-900` (light) / `zinc-50` (dark)
- **Text Secondary**: `zinc-600` (light) / `zinc-400` (dark)

### Semantic Colors
- **Success**: `green-600` (context saved, action complete)
- **Warning**: `amber-600` (large context, quota warning)
- **Error**: `red-600` (failed capture, permission denied)
- **Info**: `blue-600` (tips, informational messages)

### Code/Data Colors
- **Code Background**: `zinc-100` (light) / `zinc-800` (dark)
- **Commit SHA**: `purple-600` (monospace, stands out)
- **Context ID**: `blue-600` (monospace, copyable)

## Typography Scale

### Headings
- **H1**: `text-3xl font-semibold` (Page titles)
- **H2**: `text-2xl font-semibold` (Section headers)
- **H3**: `text-xl font-semibold` (Card titles)
- **H4**: `text-lg font-medium` (Subsections)

### Body
- **Body Large**: `text-base` (Primary content)
- **Body**: `text-sm` (Secondary content)
- **Caption**: `text-xs` (Timestamps, meta)

### Code
- **Inline Code**: `font-mono text-sm bg-zinc-100 px-1 py-0.5 rounded`
- **Code Block**: `font-mono text-sm bg-zinc-100 p-4 rounded-lg`

## Component Library

### Buttons
```tsx
// Primary: Main actions (Save, Submit, Create)
<Button variant="default">Create Context</Button>

// Secondary: Alternative actions (Cancel, Back)
<Button variant="secondary">Cancel</Button>

// Ghost: Subtle actions (in tables, cards)
<Button variant="ghost">View</Button>

// Destructive: Dangerous actions (Delete, Remove)
<Button variant="destructive">Delete</Button>
```

### Cards
```tsx
// Standard card with header and content
<Card>
  <CardHeader>
    <CardTitle>Context abc123d</CardTitle>
    <CardDescription>61 messages, 2 sessions</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

### Badges
```tsx
// Status indicators
<Badge variant="default">61 messages</Badge>
<Badge variant="secondary">2 sessions</Badge>
<Badge variant="outline">member</Badge>
```

## Interaction Patterns

### Context Actions
1. **View Context**: Click card/row → Navigate to detail page
2. **Copy Context ID**: Click copy icon → Toast notification
3. **Download JSONL**: Click download → File download
4. **Restore Locally**: Click restore → Modal with CLI command

### Team Switching
1. Click team dropdown in header
2. Select different team
3. Page refreshes with new team context
4. Recent selections remembered

### Filtering
1. Select filter criteria in sidebar
2. Results update in real-time
3. Filter badges shown above results
4. Clear filters button when active

## Edge Cases & Empty States

### No Contexts
```
┌─────────────────────────────────────┐
│         📦                          │
│    No contexts yet                  │
│                                     │
│    Start capturing Claude           │
│    conversations by running:        │
│                                     │
│    $ cc-init --team "Your Team"     │
│    $ git commit -m "message"        │
│                                     │
│    [View Documentation]             │
└─────────────────────────────────────┘
```

### No Team Members
```
┌─────────────────────────────────────┐
│         👥                          │
│    You're the only member           │
│                                     │
│    Invite teammates to collaborate: │
│                                     │
│    [Invite Member]                  │
└─────────────────────────────────────┘
```

### Context Too Large
```
⚠️ This context is very large (1,245 messages)
   Loading may take a few seconds...

   [View Anyway]  [Download Instead]
```

### Permission Denied
```
❌ You don't have access to this context

   This context belongs to a team you're not a member of.
   Contact your team admin for access.

   [Back to Dashboard]
```

## Mobile Responsive Breakpoints

### Desktop (≥1024px)
- Full sidebar navigation
- Multi-column layouts
- Expanded cards

### Tablet (768px - 1023px)
- Collapsible sidebar
- 2-column grids
- Compact cards

### Mobile (<768px)
- Hamburger menu
- Single column
- Stacked layouts
- Bottom navigation (optional)

## Future Enhancements

### Phase 2 Features
- **Real-time Collaboration**: Live cursor positions in contexts
- **Context Annotations**: Add comments to specific messages
- **Custom Themes**: User-selectable color schemes
- **Keyboard Shortcuts**: Power user navigation
- **Context Graph**: Visual timeline of related contexts

### Advanced Features
- **AI Search**: Natural language context search
- **Context Insights**: Auto-generated summaries
- **Export Templates**: Custom export formats
- **Webhooks Dashboard**: Configure integrations
- **Audit Log Viewer**: Security and compliance
