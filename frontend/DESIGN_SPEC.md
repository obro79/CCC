# Claude Code Context Manager - UI Design Specification

## Table of Contents
1. [Design Philosophy](#design-philosophy)
2. [Design System](#design-system)
3. [Component Library](#component-library)
4. [Page Layouts](#page-layouts)
5. [Responsive Behavior](#responsive-behavior)
6. [Accessibility](#accessibility)
7. [Implementation Guidelines](#implementation-guidelines)

---

## Design Philosophy

### Core Principles

The Claude Code Context Manager interface should embody these principles to match Claude's aesthetic:

1. **Clarity First**: Clean, minimal interface that prioritizes content and readability
2. **Purposeful Whitespace**: Generous spacing that lets content breathe
3. **Subtle Interactions**: Smooth, understated transitions and hover states
4. **Consistent Hierarchy**: Clear visual hierarchy through typography and spacing
5. **Dark Mode Native**: Both light and dark modes are first-class experiences

### Visual Inspiration

The design takes direct inspiration from Claude's web interface:
- Clean, conversation-focused layout
- Minimal chrome and UI elements
- Sophisticated neutral color palette
- Smooth transitions and micro-interactions
- Clear typography with excellent readability

---

## Design System

### Color Palette

Our color system uses OKLCH color space for perceptually uniform colors that work beautifully in both light and dark modes.

#### Light Mode Colors

```css
/* Base Colors */
--background: oklch(1 0 0);              /* Pure white */
--foreground: oklch(0.145 0 0);          /* Near black text */
--card: oklch(1 0 0);                    /* White cards */
--card-foreground: oklch(0.145 0 0);     /* Card text */

/* Interactive Elements */
--primary: oklch(0.205 0 0);             /* Dark gray for primary actions */
--primary-foreground: oklch(0.985 0 0);  /* White text on primary */
--secondary: oklch(0.97 0 0);            /* Light gray for secondary */
--secondary-foreground: oklch(0.205 0 0); /* Dark text on secondary */

/* Muted & Accents */
--muted: oklch(0.97 0 0);                /* Very light gray backgrounds */
--muted-foreground: oklch(0.556 0 0);    /* Medium gray for secondary text */
--accent: oklch(0.97 0 0);               /* Light accent background */
--accent-foreground: oklch(0.205 0 0);   /* Dark accent text */

/* Semantic Colors */
--destructive: oklch(0.577 0.245 27.325); /* Red for destructive actions */
--border: oklch(0.922 0 0);              /* Subtle borders */
--input: oklch(0.922 0 0);               /* Input borders */
--ring: oklch(0.708 0 0);                /* Focus rings */
```

#### Dark Mode Colors

```css
/* Base Colors */
--background: oklch(0.145 0 0);          /* Very dark gray, not pure black */
--foreground: oklch(0.985 0 0);          /* Off-white text */
--card: oklch(0.205 0 0);                /* Slightly lighter than background */
--card-foreground: oklch(0.985 0 0);     /* Card text */

/* Interactive Elements */
--primary: oklch(0.922 0 0);             /* Light gray for primary */
--primary-foreground: oklch(0.205 0 0);  /* Dark text on primary */
--secondary: oklch(0.269 0 0);           /* Medium dark gray */
--secondary-foreground: oklch(0.985 0 0); /* Light text on secondary */

/* Muted & Accents */
--muted: oklch(0.269 0 0);               /* Medium dark backgrounds */
--muted-foreground: oklch(0.708 0 0);    /* Medium light for secondary text */
--accent: oklch(0.269 0 0);              /* Accent background */
--accent-foreground: oklch(0.985 0 0);   /* Light accent text */

/* Semantic Colors */
--destructive: oklch(0.704 0.191 22.216); /* Softer red for dark mode */
--border: oklch(1 0 0 / 10%);            /* Subtle semi-transparent borders */
--input: oklch(1 0 0 / 15%);             /* Slightly more visible inputs */
--ring: oklch(0.556 0 0);                /* Focus rings */
```

#### Sidebar Colors (Both Modes)

```css
/* Light Mode Sidebar */
--sidebar: oklch(0.985 0 0);             /* Very light gray */
--sidebar-foreground: oklch(0.145 0 0);  /* Dark text */
--sidebar-primary: oklch(0.205 0 0);     /* Dark active state */
--sidebar-primary-foreground: oklch(0.985 0 0); /* White on active */
--sidebar-accent: oklch(0.97 0 0);       /* Hover background */
--sidebar-accent-foreground: oklch(0.205 0 0); /* Hover text */
--sidebar-border: oklch(0.922 0 0);      /* Border color */
--sidebar-ring: oklch(0.708 0 0);        /* Focus ring */

/* Dark Mode Sidebar */
--sidebar: oklch(0.205 0 0);             /* Dark gray */
--sidebar-foreground: oklch(0.985 0 0);  /* Light text */
--sidebar-primary: oklch(0.488 0.243 264.376); /* Purple accent */
--sidebar-primary-foreground: oklch(0.985 0 0); /* White on active */
--sidebar-accent: oklch(0.269 0 0);      /* Hover background */
--sidebar-accent-foreground: oklch(0.985 0 0); /* Hover text */
--sidebar-border: oklch(1 0 0 / 10%);    /* Subtle border */
--sidebar-ring: oklch(0.556 0 0);        /* Focus ring */
```

#### Semantic Color Usage

| Use Case | Light Mode | Dark Mode | Tailwind Class |
|----------|------------|-----------|----------------|
| Success state | `oklch(0.646 0.222 41.116)` | `oklch(0.696 0.17 162.48)` | `text-chart-1` |
| Info state | `oklch(0.6 0.118 184.704)` | `oklch(0.769 0.188 70.08)` | `text-chart-2` |
| Warning state | `oklch(0.828 0.189 84.429)` | `oklch(0.645 0.246 16.439)` | `text-chart-4` |
| Error state | `oklch(0.577 0.245 27.325)` | `oklch(0.704 0.191 22.216)` | `text-destructive` |
| Code/Data | `oklch(0.398 0.07 227.392)` | `oklch(0.488 0.243 264.376)` | `text-chart-3` |

### Typography

#### Font Families

```css
--font-sans: var(--font-geist-sans);  /* Geist Sans for UI */
--font-mono: var(--font-geist-mono);  /* Geist Mono for code */
```

**Usage Guidelines:**
- Use Geist Sans for all UI text, headings, and body content
- Use Geist Mono for code blocks, commit SHAs, context IDs, and technical data
- Never mix fonts within the same element unless showing code inline

#### Type Scale

| Element | Classes | Size | Weight | Line Height | Use Case |
|---------|---------|------|--------|-------------|----------|
| H1 | `text-3xl font-semibold` | 1.875rem (30px) | 600 | 1.2 | Page titles |
| H2 | `text-2xl font-semibold` | 1.5rem (24px) | 600 | 1.3 | Section headers |
| H3 | `text-xl font-semibold` | 1.25rem (20px) | 600 | 1.4 | Subsection headers, card titles |
| H4 | `text-lg font-medium` | 1.125rem (18px) | 500 | 1.5 | Small section headers |
| Body Large | `text-base` | 1rem (16px) | 400 | 1.5 | Primary content, important text |
| Body | `text-sm` | 0.875rem (14px) | 400 | 1.5 | Secondary content, descriptions |
| Caption | `text-xs` | 0.75rem (12px) | 400 | 1.4 | Timestamps, metadata, labels |
| Code Inline | `text-sm font-mono` | 0.875rem (14px) | 400 | 1.5 | Inline code snippets |
| Code Block | `text-sm font-mono` | 0.875rem (14px) | 400 | 1.6 | Code blocks, JSONL |

#### Typography Examples

```tsx
/* Page Title */
<h1 className="text-3xl font-semibold text-foreground">
  Context Browser
</h1>

/* Section Header */
<h2 className="text-2xl font-semibold text-foreground">
  Recent Contexts
</h2>

/* Card Title */
<h3 className="text-xl font-semibold text-card-foreground">
  Context abc123d
</h3>

/* Body Text */
<p className="text-sm text-muted-foreground">
  61 messages across 2 sessions
</p>

/* Timestamp */
<span className="text-xs text-muted-foreground">
  2 days ago
</span>

/* Commit SHA */
<code className="font-mono text-sm text-chart-3 bg-muted px-1.5 py-0.5 rounded">
  abc123d
</code>
```

### Spacing System

Based on 4px base unit for consistent rhythm.

| Name | Value | Rem | Tailwind | Use Case |
|------|-------|-----|----------|----------|
| xs | 4px | 0.25rem | `1` | Tight inline spacing |
| sm | 8px | 0.5rem | `2` | Small gaps, badge padding |
| md | 12px | 0.75rem | `3` | Default element spacing |
| base | 16px | 1rem | `4` | Standard spacing |
| lg | 20px | 1.25rem | `5` | Section spacing |
| xl | 24px | 1.5rem | `6` | Large section spacing |
| 2xl | 32px | 2rem | `8` | Major section breaks |
| 3xl | 48px | 3rem | `12` | Page-level spacing |
| 4xl | 64px | 4rem | `16` | Hero sections |

#### Spacing Patterns

```tsx
/* Card Padding */
<div className="p-6">  {/* 24px padding */}

/* Section Gap */
<div className="space-y-8">  {/* 32px vertical spacing */}

/* Grid Gap */
<div className="grid grid-cols-3 gap-6">  {/* 24px gap */}

/* Inline Elements */
<div className="flex items-center gap-2">  {/* 8px gap */}

/* Page Margins */
<main className="px-8 py-12">  {/* 32px horizontal, 48px vertical */}
```

### Border Radius

All border radius values are derived from the base `--radius` value for consistency.

```css
--radius: 0.625rem;              /* 10px - base radius */
--radius-sm: calc(var(--radius) - 4px);  /* 6px */
--radius-md: calc(var(--radius) - 2px);  /* 8px */
--radius-lg: var(--radius);              /* 10px */
--radius-xl: calc(var(--radius) + 4px);  /* 14px */
```

| Element | Radius | Tailwind Class | Use Case |
|---------|--------|----------------|----------|
| Buttons, Inputs | 10px | `rounded-lg` | Interactive elements |
| Cards | 10px | `rounded-lg` | Content containers |
| Badges | 6px | `rounded-sm` | Small inline elements |
| Modals | 14px | `rounded-xl` | Large overlays |
| Code blocks | 8px | `rounded-md` | Inline code |
| Avatars | Full | `rounded-full` | Profile images |

### Shadows

Subtle shadows that enhance depth without overwhelming.

```css
/* Light Mode Shadows */
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);

/* Dark Mode Shadows (more pronounced) */
.dark --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.3);
.dark --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.4);
.dark --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.5), 0 4px 6px -4px rgb(0 0 0 / 0.5);
```

| Use Case | Shadow | Tailwind Class |
|----------|--------|----------------|
| Cards (resting) | sm | `shadow-sm` |
| Cards (hover) | md | `hover:shadow-md` |
| Modals | lg | `shadow-lg` |
| Popovers | xl | `shadow-xl` |

### Transitions

Smooth, purposeful animations using CSS transitions.

```css
/* Standard Transition */
transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);

/* Color Transitions Only */
transition: color 150ms ease-in-out, background-color 150ms ease-in-out;

/* Transform Transitions */
transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1);
```

**Timing Guidelines:**
- Micro-interactions (hover, focus): 150ms
- Small movements (slide, fade): 200ms
- Large movements (modal open): 300ms
- Never exceed 400ms for UI transitions

**Tailwind Classes:**
```tsx
/* Standard Hover */
<button className="transition-colors hover:bg-accent">

/* Transform */
<div className="transition-transform hover:scale-105">

/* Multiple Properties */
<div className="transition-all duration-200 hover:shadow-md">
```

---

## Component Library

### 1. ContextCard

A card component that displays context metadata, used throughout the dashboard and context browser.

#### Variants

**Compact** - For grid displays
```tsx
<Card className="group hover:shadow-md transition-shadow cursor-pointer">
  <CardHeader className="pb-3">
    <div className="flex items-start justify-between">
      <CardTitle className="text-lg font-semibold">
        <code className="font-mono text-chart-3">abc123d</code>
      </CardTitle>
      <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
        <MoreVertical className="h-4 w-4" />
      </Button>
    </div>
    <CardDescription className="text-xs text-muted-foreground">
      2 days ago
    </CardDescription>
  </CardHeader>
  <CardContent>
    <div className="flex items-center gap-3 text-sm">
      <Badge variant="secondary" className="font-mono">
        61 msgs
      </Badge>
      <Badge variant="outline" className="font-mono">
        2 sessions
      </Badge>
    </div>
    <div className="mt-3 flex items-center gap-2">
      <Avatar className="h-6 w-6">
        <AvatarFallback className="text-xs">AL</AvatarFallback>
      </Avatar>
      <span className="text-xs text-muted-foreground">Alice Chen</span>
    </div>
  </CardContent>
</Card>
```

**Full** - For list displays
```tsx
<Card className="hover:shadow-md transition-shadow">
  <CardContent className="p-6">
    <div className="flex items-start justify-between">
      <div className="space-y-3 flex-1">
        {/* Header */}
        <div className="flex items-center gap-3">
          <code className="font-mono text-base font-semibold text-chart-3">
            abc123d
          </code>
          <Badge variant="secondary" className="font-mono text-xs">
            61 messages
          </Badge>
          <Badge variant="outline" className="font-mono text-xs">
            2 sessions
          </Badge>
        </div>

        {/* Metadata */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs">AL</AvatarFallback>
            </Avatar>
            <span>Alice Chen</span>
          </div>
          <span>•</span>
          <time>Jan 20, 2025 at 3:30 PM</time>
          <span>•</span>
          <span className="font-mono text-xs">ctx-550e8400</span>
        </div>

        {/* Preview */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          Conversation about implementing authentication system with OAuth...
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 ml-4">
        <Button variant="ghost" size="icon">
          <Copy className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Download className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>
    </div>
  </CardContent>
</Card>
```

#### Visual Specifications

- **Padding**: 24px (p-6)
- **Border**: 1px solid border color
- **Border Radius**: 10px (rounded-lg)
- **Background**: card color
- **Hover State**: shadow-md, maintain border
- **Transition**: shadow 150ms ease
- **Spacing**: 12px between elements (space-y-3)

### 2. ConversationMessage

Message bubbles that match Claude's conversation interface.

#### User Message
```tsx
<div className="flex justify-end mb-6">
  <div className="max-w-3xl">
    <div className="flex items-start gap-3 flex-row-reverse">
      <Avatar className="h-8 w-8 mt-1">
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="bg-primary text-primary-foreground rounded-lg px-4 py-3">
          <p className="text-sm leading-relaxed">
            Implement authentication system with OAuth
          </p>
        </div>
        <div className="mt-1 px-1 flex items-center gap-2 text-xs text-muted-foreground">
          <time>14:30:45</time>
          <button className="hover:text-foreground transition-colors">
            <Copy className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
```

#### Assistant Message
```tsx
<div className="flex justify-start mb-6">
  <div className="max-w-3xl">
    <div className="flex items-start gap-3">
      <Avatar className="h-8 w-8 mt-1 bg-chart-3">
        <AvatarFallback className="text-white text-xs">C</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="bg-muted rounded-lg px-4 py-3">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p>I'll help you implement an authentication system...</p>
            <pre className="bg-card border border-border rounded-md p-3 mt-3">
              <code className="font-mono text-xs">npm install next-auth</code>
            </pre>
          </div>
        </div>
        <div className="mt-1 px-1 flex items-center gap-2 text-xs text-muted-foreground">
          <time>14:31:02</time>
          <button className="hover:text-foreground transition-colors">
            <Copy className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
```

#### System Message / Session Boundary
```tsx
<div className="flex justify-center my-8">
  <div className="flex items-center gap-3 px-4 py-2 bg-muted rounded-full border border-border">
    <div className="h-1 w-1 rounded-full bg-muted-foreground" />
    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
      New Session (session-2)
    </span>
    <div className="h-1 w-1 rounded-full bg-muted-foreground" />
  </div>
</div>
```

#### Visual Specifications

- **User Messages**:
  - Background: primary color
  - Text: primary-foreground
  - Alignment: Right-aligned
  - Max Width: 768px (max-w-3xl)
  - Padding: 12px 16px (px-4 py-3)
  - Border Radius: 10px (rounded-lg)
  - Margin Bottom: 24px (mb-6)

- **Assistant Messages**:
  - Background: muted color
  - Text: foreground
  - Alignment: Left-aligned
  - Max Width: 768px (max-w-3xl)
  - Padding: 12px 16px (px-4 py-3)
  - Border Radius: 10px (rounded-lg)
  - Margin Bottom: 24px (mb-6)

- **System Messages**:
  - Background: muted
  - Border: 1px border color
  - Border Radius: Full (rounded-full)
  - Text: xs, uppercase, tracking-wide
  - Margin: 32px vertical (my-8)

### 3. Sidebar Navigation

Persistent left sidebar matching Claude's navigation style.

```tsx
<aside className="fixed inset-y-0 left-0 w-64 bg-sidebar border-r border-sidebar-border">
  <div className="flex flex-col h-full">
    {/* Logo / Brand */}
    <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
      <div className="h-8 w-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
        <Layers className="h-4 w-4 text-sidebar-primary-foreground" />
      </div>
      <span className="font-semibold text-sidebar-foreground">
        Context Manager
      </span>
    </div>

    {/* Navigation Links */}
    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
      {/* Active Link */}
      <a
        href="/dashboard"
        className="flex items-center gap-3 px-3 py-2 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
      >
        <LayoutDashboard className="h-4 w-4" />
        <span className="text-sm font-medium">Dashboard</span>
      </a>

      {/* Inactive Links */}
      <a
        href="/contexts"
        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
      >
        <MessageSquare className="h-4 w-4" />
        <span className="text-sm font-medium">Contexts</span>
      </a>

      <a
        href="/repositories"
        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
      >
        <Folder className="h-4 w-4" />
        <span className="text-sm font-medium">Repositories</span>
      </a>

      <a
        href="/teams"
        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
      >
        <Users className="h-4 w-4" />
        <span className="text-sm font-medium">Teams</span>
      </a>
    </nav>

    {/* User Menu */}
    <div className="border-t border-sidebar-border p-3">
      <button className="flex items-center gap-3 px-3 py-2 w-full rounded-lg hover:bg-sidebar-accent transition-colors">
        <Avatar className="h-8 w-8">
          <AvatarFallback>AC</AvatarFallback>
        </Avatar>
        <div className="flex-1 text-left">
          <div className="text-sm font-medium text-sidebar-foreground">
            Alice Chen
          </div>
          <div className="text-xs text-sidebar-foreground/60">
            alice@example.com
          </div>
        </div>
        <ChevronRight className="h-4 w-4 text-sidebar-foreground/60" />
      </button>
    </div>
  </div>
</aside>
```

#### Visual Specifications

- **Width**: 256px (w-64)
- **Background**: sidebar color
- **Border**: Right border, sidebar-border color
- **Position**: Fixed, full height
- **Padding**:
  - Header: 24px horizontal, 20px vertical
  - Navigation: 12px all sides
  - Links: 12px horizontal, 8px vertical
- **Link States**:
  - Default: sidebar-foreground
  - Hover: sidebar-accent background
  - Active: sidebar-primary background
- **Transitions**: colors 150ms ease

### 4. Header / Top Bar

Page header with breadcrumbs and actions.

```tsx
<header className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
  <div className="flex items-center justify-between px-8 py-4">
    {/* Left: Breadcrumbs */}
    <div className="flex items-center gap-2 text-sm">
      <a href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
        Dashboard
      </a>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
      <span className="text-foreground font-medium">Contexts</span>
    </div>

    {/* Right: Actions */}
    <div className="flex items-center gap-3">
      {/* Team Switcher */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Users className="h-4 w-4" />
            <span>My Team</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem>Personal</DropdownMenuItem>
          <DropdownMenuItem>My Team</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Plus className="h-4 w-4 mr-2" />
            Create Team
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Search */}
      <Button variant="outline" size="icon">
        <Search className="h-4 w-4" />
      </Button>

      {/* User Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-9 w-9 rounded-full">
            <Avatar className="h-9 w-9">
              <AvatarFallback>AC</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">Alice Chen</p>
              <p className="text-xs text-muted-foreground">alice@example.com</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Documentation</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive">
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>
</header>
```

#### Visual Specifications

- **Position**: Sticky top
- **Background**: background/95 with backdrop blur
- **Border**: Bottom border
- **Padding**: 32px horizontal, 16px vertical (px-8 py-4)
- **Height**: Auto (based on content)
- **Z-index**: 10

### 5. Buttons

Button variants matching the design system.

```tsx
/* Primary Button */
<Button variant="default" className="gap-2">
  <Plus className="h-4 w-4" />
  Create Context
</Button>

/* Secondary Button */
<Button variant="secondary" className="gap-2">
  Cancel
</Button>

/* Outline Button */
<Button variant="outline" className="gap-2">
  <Filter className="h-4 w-4" />
  Filter
</Button>

/* Ghost Button */
<Button variant="ghost" className="gap-2">
  View Details
</Button>

/* Destructive Button */
<Button variant="destructive" className="gap-2">
  <Trash className="h-4 w-4" />
  Delete
</Button>

/* Icon Button */
<Button variant="ghost" size="icon">
  <MoreVertical className="h-4 w-4" />
</Button>
```

#### Visual Specifications

| Variant | Background | Text | Border | Hover Background | Padding |
|---------|------------|------|--------|-----------------|---------|
| Default | primary | primary-foreground | none | primary/90 | 12px 24px |
| Secondary | secondary | secondary-foreground | none | secondary/80 | 12px 24px |
| Outline | transparent | foreground | border | accent | 12px 24px |
| Ghost | transparent | foreground | none | accent | 12px 24px |
| Destructive | destructive | destructive-foreground | none | destructive/90 | 12px 24px |
| Icon | transparent | foreground | none | accent | 8px (square) |

**Sizes:**
- Default: h-10 px-6 (40px height)
- Small: h-8 px-4 (32px height)
- Large: h-12 px-8 (48px height)
- Icon: h-10 w-10 (40x40px square)

### 6. Input Fields

Form inputs matching the design aesthetic.

```tsx
/* Text Input */
<div className="space-y-2">
  <Label htmlFor="email" className="text-sm font-medium">
    Email
  </Label>
  <Input
    id="email"
    type="email"
    placeholder="alice@example.com"
    className="h-10"
  />
  <p className="text-xs text-muted-foreground">
    We'll never share your email.
  </p>
</div>

/* Search Input */
<div className="relative">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
  <Input
    type="search"
    placeholder="Search contexts..."
    className="pl-9 h-10"
  />
</div>

/* Textarea */
<Textarea
  placeholder="Describe the context..."
  className="min-h-24 resize-none"
/>
```

#### Visual Specifications

- **Height**: 40px (h-10)
- **Padding**: 12px horizontal (px-3)
- **Background**: background
- **Border**: 1px input color
- **Border Radius**: 10px (rounded-lg)
- **Font Size**: 14px (text-sm)
- **Focus State**: ring-2 ring-ring ring-offset-2
- **Placeholder**: text-muted-foreground
- **Disabled**: opacity-50, cursor-not-allowed

### 7. Badges

Status and count indicators.

```tsx
/* Default Badge */
<Badge variant="default" className="font-mono">
  61 messages
</Badge>

/* Secondary Badge */
<Badge variant="secondary" className="font-mono">
  2 sessions
</Badge>

/* Outline Badge */
<Badge variant="outline">
  member
</Badge>

/* Destructive Badge */
<Badge variant="destructive">
  error
</Badge>

/* Custom Color Badge */
<Badge className="bg-chart-1 text-white">
  success
</Badge>
```

#### Visual Specifications

- **Height**: Auto
- **Padding**: 2px 8px (px-2 py-0.5)
- **Border Radius**: 6px (rounded-sm)
- **Font Size**: 12px (text-xs)
- **Font Weight**: 500 (font-medium)
- **Line Height**: 1

| Variant | Background | Text | Border |
|---------|------------|------|--------|
| Default | primary | primary-foreground | none |
| Secondary | secondary | secondary-foreground | none |
| Outline | transparent | foreground | border |
| Destructive | destructive | destructive-foreground | none |

### 8. Code Blocks

Syntax-highlighted code display.

```tsx
/* Inline Code */
<p>
  Install dependencies with{" "}
  <code className="relative rounded bg-muted px-1.5 py-0.5 font-mono text-sm">
    npm install
  </code>
</p>

/* Code Block */
<div className="relative">
  <pre className="overflow-x-auto rounded-lg bg-muted p-4 border border-border">
    <code className="font-mono text-sm text-foreground">
{`function captureContext() {
  const sessions = discoverSessions();
  const merged = mergeSessions(sessions);
  return storeContext(merged);
}`}
    </code>
  </pre>
  <Button
    variant="ghost"
    size="icon"
    className="absolute top-2 right-2 h-8 w-8"
  >
    <Copy className="h-4 w-4" />
  </Button>
</div>

/* JSONL Display */
<pre className="overflow-x-auto rounded-lg bg-card border border-border p-4 font-mono text-xs">
{`{"type":"user","content":"Implement auth","timestamp":"14:00:00"}
{"type":"assistant","content":"I'll help...","timestamp":"14:00:05"}
{"type":"system","content":"--- NEW SESSION ---","timestamp":"14:20:00"}`}
</pre>
```

#### Visual Specifications

**Inline Code:**
- Background: muted
- Padding: 2px 6px (px-1.5 py-0.5)
- Border Radius: 6px (rounded)
- Font: mono, 14px

**Code Blocks:**
- Background: muted (light) / card (dark)
- Border: 1px border color
- Padding: 16px (p-4)
- Border Radius: 10px (rounded-lg)
- Font: mono, 14px
- Line Height: 1.6
- Overflow: x-auto (horizontal scroll)

**Syntax Highlighting Colors:**
- Keywords: `text-chart-3` (purple/blue)
- Strings: `text-chart-1` (green)
- Numbers: `text-chart-2` (teal)
- Comments: `text-muted-foreground`
- Functions: `text-chart-4` (orange)

### 9. Empty States

Friendly placeholders when no content exists.

```tsx
<div className="flex flex-col items-center justify-center py-16 px-4 text-center">
  <div className="mb-4 rounded-full bg-muted p-6">
    <MessageSquare className="h-12 w-12 text-muted-foreground" />
  </div>
  <h3 className="text-lg font-semibold mb-2">No contexts yet</h3>
  <p className="text-sm text-muted-foreground mb-6 max-w-md">
    Start capturing Claude conversations by running the CLI in your repository.
  </p>
  <div className="bg-muted rounded-lg p-4 mb-6 font-mono text-sm text-left">
    <div className="text-muted-foreground">$ cc-init --team "Your Team"</div>
    <div className="text-muted-foreground">$ git commit -m "Initial commit"</div>
  </div>
  <Button className="gap-2">
    <ExternalLink className="h-4 w-4" />
    View Documentation
  </Button>
</div>
```

#### Visual Specifications

- **Padding**: 64px vertical (py-16)
- **Alignment**: Center
- **Max Width**: 448px (max-w-md)
- **Icon Container**:
  - Size: 96px circle
  - Background: muted
  - Icon: 48px, muted-foreground
- **Spacing**: 16px between elements
- **Code Block**: Same as regular code blocks

---

## Page Layouts

### 1. Dashboard

Main landing page with stats and recent contexts.

```tsx
<div className="flex min-h-screen">
  {/* Sidebar */}
  <Sidebar />

  {/* Main Content */}
  <main className="flex-1 ml-64">
    {/* Header */}
    <Header />

    {/* Page Content */}
    <div className="px-8 py-12 space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-semibold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your team's Claude Code contexts
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Contexts</CardDescription>
            <CardTitle className="text-4xl">125</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              <span className="text-chart-1">+12%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Repositories</CardDescription>
            <CardTitle className="text-4xl">8</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Across 3 teams
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Team Members</CardDescription>
            <CardTitle className="text-4xl">42</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              <span className="text-chart-1">+3</span> this week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Contexts */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Recent Contexts</h2>
          <Button variant="ghost" className="gap-2">
            View All
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* ContextCard components */}
          <ContextCard />
          <ContextCard />
          <ContextCard />
        </div>
      </div>

      {/* Activity Timeline */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
        <Card>
          <CardContent className="p-6">
            {/* Activity items */}
          </CardContent>
        </Card>
      </div>
    </div>
  </main>
</div>
```

#### Layout Specifications

- **Sidebar**: Fixed 256px width
- **Main Content**: Flexible, left margin 256px
- **Content Padding**: 32px horizontal, 48px vertical
- **Section Spacing**: 32px (space-y-8)
- **Grid**: Responsive, 1/2/3 columns
- **Grid Gap**: 24px (gap-6)

### 2. Context Browser

List view with filters for browsing all contexts.

```tsx
<div className="flex min-h-screen">
  <Sidebar />

  <main className="flex-1 ml-64">
    <Header />

    <div className="flex">
      {/* Filters Sidebar */}
      <aside className="w-64 border-r border-border bg-background p-6 space-y-6">
        <div>
          <h3 className="text-sm font-semibold mb-3">Repository</h3>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="All repositories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All repositories</SelectItem>
              <SelectItem value="app">my-app</SelectItem>
              <SelectItem value="api">backend-api</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-3">Date Range</h3>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="All time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last week</SelectItem>
              <SelectItem value="month">Last month</SelectItem>
              <SelectItem value="year">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-3">Author</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox id="alice" />
              <span className="text-sm">Alice Chen (42)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox id="bob" />
              <span className="text-sm">Bob Smith (18)</span>
            </label>
          </div>
        </div>

        <Button variant="outline" className="w-full gap-2">
          <RotateCcw className="h-4 w-4" />
          Clear Filters
        </Button>
      </aside>

      {/* Context List */}
      <div className="flex-1 px-8 py-12 space-y-6">
        {/* Search & Actions */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search contexts..."
              className="pl-9"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Sort
          </Button>
        </div>

        {/* Results Count */}
        <p className="text-sm text-muted-foreground">
          Showing 125 contexts
        </p>

        {/* Context Cards */}
        <div className="space-y-4">
          <ContextCard variant="full" />
          <ContextCard variant="full" />
          <ContextCard variant="full" />
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="icon" disabled>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="default" size="sm">1</Button>
          <Button variant="outline" size="sm">2</Button>
          <Button variant="outline" size="sm">3</Button>
          <Button variant="outline" size="sm">4</Button>
          <Button variant="outline" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  </main>
</div>
```

#### Layout Specifications

- **Filter Sidebar**: Fixed 256px width, right border
- **Content Area**: Flexible width
- **Content Padding**: 32px horizontal, 48px vertical
- **Card Spacing**: 16px (space-y-4)
- **Filter Spacing**: 24px (space-y-6)

### 3. Context Viewer

Full conversation view matching Claude's interface.

```tsx
<div className="flex min-h-screen">
  <Sidebar />

  <main className="flex-1 ml-64">
    <Header />

    <div className="flex">
      {/* Conversation Area */}
      <div className="flex-1 px-8 py-12">
        {/* Context Header */}
        <div className="mb-8 pb-6 border-b border-border">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-semibold mb-2">
                Context{" "}
                <code className="font-mono text-chart-3">abc123d</code>
              </h1>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span>61 messages</span>
                <span>•</span>
                <span>2 sessions</span>
                <span>•</span>
                <time>Jan 20, 2025 at 3:30 PM</time>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Copy className="h-4 w-4" />
                Copy ID
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="max-w-4xl mx-auto space-y-6">
          <ConversationMessage type="user" />
          <ConversationMessage type="assistant" />
          <SessionBoundary />
          <ConversationMessage type="user" />
          <ConversationMessage type="assistant" />
        </div>
      </div>

      {/* Metadata Sidebar */}
      <aside className="w-80 border-l border-border bg-background p-6 space-y-6">
        <div>
          <h3 className="text-sm font-semibold mb-3">Metadata</h3>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-muted-foreground">Context ID</dt>
              <dd className="font-mono text-xs mt-1">ctx-550e8400</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Commit SHA</dt>
              <dd className="font-mono text-xs mt-1 text-chart-3">abc123d</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Author</dt>
              <dd className="flex items-center gap-2 mt-1">
                <Avatar className="h-5 w-5">
                  <AvatarFallback className="text-xs">AC</AvatarFallback>
                </Avatar>
                <span>Alice Chen</span>
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Repository</dt>
              <dd className="mt-1">my-app</dd>
            </div>
          </dl>
        </div>

        <Separator />

        <div>
          <h3 className="text-sm font-semibold mb-3">Sessions</h3>
          <div className="space-y-2">
            <button className="flex items-center gap-2 text-sm w-full text-left p-2 rounded-lg hover:bg-accent transition-colors">
              <div className="h-1.5 w-1.5 rounded-full bg-chart-3" />
              <span className="font-mono text-xs">session-1</span>
              <span className="text-muted-foreground ml-auto">45 msgs</span>
            </button>
            <button className="flex items-center gap-2 text-sm w-full text-left p-2 rounded-lg hover:bg-accent transition-colors">
              <div className="h-1.5 w-1.5 rounded-full bg-chart-3" />
              <span className="font-mono text-xs">session-2</span>
              <span className="text-muted-foreground ml-auto">16 msgs</span>
            </button>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-sm font-semibold mb-3">Actions</h3>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start gap-2" size="sm">
              <RotateCcw className="h-4 w-4" />
              Restore Locally
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2" size="sm">
              <Share className="h-4 w-4" />
              Share Link
            </Button>
          </div>
        </div>
      </aside>
    </div>
  </main>
</div>
```

#### Layout Specifications

- **Conversation Area**: Flexible, max-width 896px (max-w-4xl) centered
- **Metadata Sidebar**: Fixed 320px width, left border
- **Content Padding**: 32px horizontal, 48px vertical
- **Message Spacing**: 24px (space-y-6)
- **Sidebar Spacing**: 24px (space-y-6)

### 4. Team Management

Team overview with member management.

```tsx
<div className="flex min-h-screen">
  <Sidebar />

  <main className="flex-1 ml-64">
    <Header />

    <div className="px-8 py-12 max-w-5xl space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-semibold mb-2">Team Management</h1>
        <p className="text-muted-foreground">
          Manage your team members and settings
        </p>
      </div>

      {/* Team Info */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>My Team</CardTitle>
              <CardDescription>team-slug</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              Edit Team
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6 text-sm">
            <div>
              <span className="text-muted-foreground">Members:</span>
              <span className="ml-2 font-medium">42</span>
            </div>
            <div>
              <span className="text-muted-foreground">Repositories:</span>
              <span className="ml-2 font-medium">8</span>
            </div>
            <div>
              <span className="text-muted-foreground">Contexts:</span>
              <span className="ml-2 font-medium">125</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invite Member */}
      <Card>
        <CardHeader>
          <CardTitle>Invite Member</CardTitle>
          <CardDescription>
            Add new team members to collaborate on contexts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="email@example.com"
              className="flex-1"
            />
            <Select defaultValue="member">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="owner">Owner</SelectItem>
              </SelectContent>
            </Select>
            <Button className="gap-2">
              <UserPlus className="h-4 w-4" />
              Invite
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Members List */}
      <Card>
        <CardHeader>
          <CardTitle>Members</CardTitle>
          <CardDescription>
            All team members and their roles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Member Row */}
            <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>AC</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">Alice Chen</div>
                  <div className="text-sm text-muted-foreground">
                    alice@example.com
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary">Owner</Badge>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* More member rows */}
          </div>
        </CardContent>
      </Card>
    </div>
  </main>
</div>
```

#### Layout Specifications

- **Max Width**: 896px (max-w-5xl)
- **Content Padding**: 32px horizontal, 48px vertical
- **Section Spacing**: 32px (space-y-8)
- **Card Spacing**: Internal 24px
- **List Item Spacing**: 16px (space-y-4)

### 5. Settings

User settings and preferences.

```tsx
<div className="flex min-h-screen">
  <Sidebar />

  <main className="flex-1 ml-64">
    <Header />

    <div className="px-8 py-12 max-w-4xl space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-semibold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Display Name</Label>
                <Input id="name" defaultValue="Alice Chen" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="alice@example.com" />
              </div>
              <div className="flex gap-2">
                <Button>Save Changes</Button>
                <Button variant="outline">Cancel</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Keys Tab */}
        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Configuration</CardTitle>
              <CardDescription>
                Configure your Supabase connection
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="url">Supabase URL</Label>
                <Input
                  id="url"
                  type="url"
                  placeholder="https://your-project.supabase.co"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="key">Anon Key</Label>
                <Input
                  id="key"
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                />
              </div>
              <Button>Update Configuration</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize how the interface looks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Theme</div>
                  <div className="text-sm text-muted-foreground">
                    Choose your preferred theme
                  </div>
                </div>
                <Select defaultValue="system">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  </main>
</div>
```

#### Layout Specifications

- **Max Width**: 768px (max-w-4xl)
- **Content Padding**: 32px horizontal, 48px vertical
- **Section Spacing**: 32px (space-y-8)
- **Tab Content Spacing**: 24px (space-y-6)
- **Form Field Spacing**: 16px (space-y-4)

---

## Responsive Behavior

### Breakpoints

Following Tailwind's default breakpoint system:

| Breakpoint | Min Width | Typical Device | Layout Changes |
|------------|-----------|----------------|----------------|
| `sm` | 640px | Large phone | Single column → 2 columns |
| `md` | 768px | Tablet portrait | Sidebar collapsible, 2-3 columns |
| `lg` | 1024px | Tablet landscape | Full sidebar, 3-4 columns |
| `xl` | 1280px | Desktop | Optimal layout |
| `2xl` | 1536px | Large desktop | Max width constraints |

### Mobile (<768px)

#### Navigation
```tsx
/* Hide sidebar, show mobile menu */
<aside className="hidden md:block fixed inset-y-0 left-0 w-64">
  {/* Sidebar content */}
</aside>

/* Mobile header with menu button */
<header className="md:hidden sticky top-0 z-50">
  <div className="flex items-center justify-between p-4">
    <Button variant="ghost" size="icon">
      <Menu className="h-5 w-5" />
    </Button>
    <div className="font-semibold">Context Manager</div>
    <Avatar className="h-8 w-8">
      <AvatarFallback>AC</AvatarFallback>
    </Avatar>
  </div>
</header>
```

#### Layout Changes
- **Sidebar**: Hidden, accessible via hamburger menu
- **Content**: Full width, no left margin
- **Grids**: Single column (grid-cols-1)
- **Cards**: Full width, reduced padding
- **Tables**: Horizontal scroll or card view
- **Spacing**: Reduced to 16px (p-4 instead of p-8)

#### Mobile-Specific Components
```tsx
/* Mobile Sheet Menu */
<Sheet>
  <SheetTrigger asChild>
    <Button variant="ghost" size="icon" className="md:hidden">
      <Menu className="h-5 w-5" />
    </Button>
  </SheetTrigger>
  <SheetContent side="left" className="w-64">
    {/* Navigation links */}
  </SheetContent>
</Sheet>

/* Stacked Actions */
<div className="flex flex-col sm:flex-row gap-2">
  <Button className="w-full sm:w-auto">Primary</Button>
  <Button variant="outline" className="w-full sm:w-auto">Secondary</Button>
</div>
```

### Tablet (768px - 1023px)

#### Layout Changes
- **Sidebar**: Collapsible, can be toggled
- **Grids**: 2 columns for cards
- **Content**: Moderate padding (24px)
- **Typography**: Maintain desktop sizes
- **Filters**: Collapsible sidebar or drawer

```tsx
/* Collapsible Sidebar */
<aside className="hidden md:block transition-all duration-200"
       className={collapsed ? "w-16" : "w-64"}>
  {/* Sidebar with toggle button */}
</aside>

/* 2-column grid */
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Cards */}
</div>
```

### Desktop (≥1024px)

Full desktop experience as shown in page layouts above.

#### Optimizations
- **Sidebar**: Always visible, full width
- **Grids**: 3-4 columns based on content
- **Content**: Full padding (32px)
- **Max Widths**: Apply max-width constraints for readability
- **Hover States**: Full interactive effects

### Touch Considerations

```tsx
/* Larger tap targets on mobile */
<Button className="h-10 md:h-9">  {/* 40px mobile, 36px desktop */}
  Click me
</Button>

/* Touch-friendly spacing */
<div className="space-y-3 md:space-y-2">  {/* More space on mobile */}
  {/* Interactive elements */}
</div>

/* Prevent hover states on touch */
<div className="md:hover:bg-accent">  {/* Hover only on desktop */}
  {/* Content */}
</div>
```

### Responsive Typography

```tsx
/* Scale headings on mobile */
<h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold">
  Page Title
</h1>

/* Adjust body text */
<p className="text-sm md:text-base">
  Body content
</p>
```

### Container Patterns

```tsx
/* Responsive container */
<div className="px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-12">
  {/* Content with responsive padding */}
</div>

/* Max width with centering */
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  {/* Centered content with max width */}
</div>
```

---

## Accessibility

### Keyboard Navigation

#### Focus Management
```tsx
/* Visible focus rings */
<Button className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
  Interactive Element
</Button>

/* Focus within containers */
<div className="focus-within:ring-2 focus-within:ring-ring">
  <Input />
</div>

/* Skip to main content */
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-background focus:border focus:border-border focus:rounded-lg"
>
  Skip to main content
</a>
```

#### Tab Order
- Logical flow: top to bottom, left to right
- Interactive elements focusable in sensible order
- Modal/drawer focus trapping when open
- Focus return to trigger after modal close

### ARIA Labels

```tsx
/* Button with icon only */
<Button variant="ghost" size="icon" aria-label="Open menu">
  <Menu className="h-4 w-4" />
</Button>

/* Search input */
<Input
  type="search"
  placeholder="Search..."
  aria-label="Search contexts"
/>

/* Status indicators */
<div role="status" aria-live="polite">
  Context saved successfully
</div>

/* Navigation */
<nav aria-label="Main navigation">
  {/* Nav links */}
</nav>
```

### Semantic HTML

```tsx
/* Use appropriate elements */
<header>  {/* Not <div className="header"> */}
<nav>     {/* For navigation */}
<main>    {/* Main content */}
<article> {/* Independent content */}
<aside>   {/* Sidebars */}
<footer>  {/* Footer content */}

/* Headings in order */
<h1>Page Title</h1>
  <h2>Section</h2>
    <h3>Subsection</h3>
  <h2>Another Section</h2>
```

### Color Contrast

All color combinations meet WCAG AA standards (4.5:1 for normal text):

| Combination | Ratio | Pass |
|-------------|-------|------|
| foreground on background | 14.8:1 | ✓ |
| muted-foreground on background | 4.7:1 | ✓ |
| primary-foreground on primary | 12.6:1 | ✓ |
| destructive-foreground on destructive | 4.8:1 | ✓ |

**Testing**: Use browser dev tools contrast checker or online tools to verify.

### Screen Reader Support

```tsx
/* Loading states */
<div aria-busy="true" aria-label="Loading contexts">
  <Spinner />
</div>

/* Dynamic content */
<div aria-live="polite" aria-atomic="true">
  {statusMessage}
</div>

/* Hidden but announced */
<span className="sr-only">
  Context abc123d, 61 messages, created 2 days ago
</span>

/* Expandable sections */
<button
  aria-expanded={isOpen}
  aria-controls="filter-panel"
>
  Filters
</button>
<div id="filter-panel" role="region">
  {/* Filters */}
</div>
```

### Form Accessibility

```tsx
/* Proper labels */
<div className="space-y-2">
  <Label htmlFor="email">Email Address</Label>
  <Input
    id="email"
    type="email"
    aria-required="true"
    aria-invalid={hasError}
    aria-describedby={hasError ? "email-error" : undefined}
  />
  {hasError && (
    <p id="email-error" className="text-sm text-destructive" role="alert">
      Please enter a valid email address
    </p>
  )}
</div>

/* Field descriptions */
<div className="space-y-2">
  <Label htmlFor="context-id">Context ID</Label>
  <Input id="context-id" aria-describedby="context-help" />
  <p id="context-help" className="text-xs text-muted-foreground">
    The unique identifier for this context
  </p>
</div>
```

### Alternative Text

```tsx
/* Avatar with fallback */
<Avatar>
  <AvatarImage src={user.avatar} alt={`${user.name}'s avatar`} />
  <AvatarFallback>{user.initials}</AvatarFallback>
</Avatar>

/* Decorative icons (hidden from screen readers) */
<ChevronRight className="h-4 w-4" aria-hidden="true" />

/* Meaningful icons (with labels) */
<Button aria-label="Copy context ID">
  <Copy className="h-4 w-4" aria-hidden="true" />
  <span className="sr-only">Copy</span>
</Button>
```

---

## Implementation Guidelines

### File Structure

```
frontend/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/
│   │   ├── layout.tsx          # Dashboard layout with sidebar
│   │   ├── page.tsx             # Dashboard page
│   │   ├── contexts/
│   │   │   ├── page.tsx         # Context browser
│   │   │   └── [id]/
│   │   │       └── page.tsx     # Context viewer
│   │   ├── repositories/
│   │   ├── teams/
│   │   └── settings/
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles
├── components/
│   ├── ui/                      # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ...
│   ├── contexts/
│   │   ├── context-card.tsx
│   │   ├── conversation-message.tsx
│   │   └── ...
│   ├── layout/
│   │   ├── sidebar.tsx
│   │   ├── header.tsx
│   │   └── ...
│   └── ...
├── lib/
│   ├── utils.ts                 # Utility functions
│   └── ...
└── public/
```

### Component Organization

#### Create Small, Focused Components
```tsx
// ❌ Bad: Monolithic component
function ContextPage() {
  return (
    <div>
      {/* 500 lines of mixed concerns */}
    </div>
  );
}

// ✓ Good: Composed components
function ContextPage() {
  return (
    <div>
      <ContextHeader context={context} />
      <ContextMetadata context={context} />
      <ConversationView messages={context.messages} />
    </div>
  );
}
```

#### Use Composition
```tsx
// Card composition example
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
  <CardFooter>
    {/* Actions */}
  </CardFooter>
</Card>
```

### Styling Patterns

#### Use Tailwind Utilities
```tsx
// ✓ Prefer Tailwind classes
<div className="flex items-center gap-4 p-6 bg-card rounded-lg border border-border">

// ❌ Avoid inline styles unless dynamic
<div style={{ padding: "24px", backgroundColor: "#fff" }}>
```

#### Use cn() for Conditional Classes
```tsx
import { cn } from "@/lib/utils";

<Button
  className={cn(
    "gap-2",
    isActive && "bg-accent",
    isDisabled && "opacity-50 cursor-not-allowed"
  )}
/>
```

#### Component Variants with CVA
```tsx
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  "inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        outline: "border border-border bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface BadgeProps extends VariantProps<typeof badgeVariants> {
  children: React.ReactNode;
}

export function Badge({ variant, children }: BadgeProps) {
  return (
    <span className={badgeVariants({ variant })}>
      {children}
    </span>
  );
}
```

### State Management

#### Server Components by Default
```tsx
// ✓ Use server components for data fetching
export default async function ContextsPage() {
  const contexts = await getContexts();

  return (
    <div>
      {contexts.map((context) => (
        <ContextCard key={context.id} context={context} />
      ))}
    </div>
  );
}
```

#### Client Components for Interactivity
```tsx
"use client";

// Only mark as client when needed
export function SearchInput() {
  const [query, setQuery] = useState("");

  return (
    <Input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

### Performance

#### Code Splitting
```tsx
// Dynamic imports for heavy components
import dynamic from "next/dynamic";

const ConversationViewer = dynamic(
  () => import("@/components/contexts/conversation-viewer"),
  { loading: () => <Spinner /> }
);
```

#### Image Optimization
```tsx
import Image from "next/image";

<Image
  src={user.avatar}
  alt={user.name}
  width={32}
  height={32}
  className="rounded-full"
/>
```

#### Virtual Scrolling for Long Lists
```tsx
import { useVirtualizer } from "@tanstack/react-virtual";

// For conversations with 1000+ messages
function VirtualizedMessages({ messages }) {
  const parentRef = useRef(null);

  const virtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
  });

  return (
    <div ref={parentRef} className="h-screen overflow-auto">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          position: "relative",
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={virtualRow.index}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            <ConversationMessage message={messages[virtualRow.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Dark Mode Implementation

#### Theme Provider
```tsx
"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </NextThemesProvider>
  );
}
```

#### Theme Toggle
```tsx
"use client";

import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
}
```

### Testing Components

#### Visual Regression Testing
```tsx
// Storybook stories for visual testing
export const Default: Story = {
  args: {
    context: mockContext,
  },
};

export const WithLongMessage: Story = {
  args: {
    context: mockContextWithLongMessage,
  },
};

export const DarkMode: Story = {
  args: {
    context: mockContext,
  },
  parameters: {
    theme: "dark",
  },
};
```

#### Accessibility Testing
```tsx
// Use axe-core for automated a11y testing
import { axe, toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);

test("should have no accessibility violations", async () => {
  const { container } = render(<ContextCard context={mockContext} />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

---

## Design Tokens Reference

### Quick Reference Table

| Token | Light Value | Dark Value | Usage |
|-------|-------------|------------|-------|
| `--background` | `oklch(1 0 0)` | `oklch(0.145 0 0)` | Page background |
| `--foreground` | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` | Primary text |
| `--card` | `oklch(1 0 0)` | `oklch(0.205 0 0)` | Card background |
| `--primary` | `oklch(0.205 0 0)` | `oklch(0.922 0 0)` | Primary buttons |
| `--muted` | `oklch(0.97 0 0)` | `oklch(0.269 0 0)` | Muted backgrounds |
| `--border` | `oklch(0.922 0 0)` | `oklch(1 0 0 / 10%)` | Borders |
| `--radius` | `0.625rem` | `0.625rem` | Base border radius |

### Tailwind Class Mapping

```tsx
// Colors
bg-background        // Page background
text-foreground      // Primary text
bg-card              // Card background
text-card-foreground // Card text
bg-primary           // Primary button
text-primary-foreground // Primary button text
bg-muted             // Muted background
text-muted-foreground   // Secondary text
border-border        // Border color

// Spacing
p-6                  // 24px padding
space-y-8            // 32px vertical spacing
gap-4                // 16px gap

// Typography
text-3xl             // 30px
font-semibold        // 600 weight
font-mono            // Geist Mono

// Border Radius
rounded-lg           // 10px
rounded-sm           // 6px
rounded-xl           // 14px
rounded-full         // Full circle

// Shadows
shadow-sm            // Subtle shadow
shadow-md            // Medium shadow
shadow-lg            // Large shadow
```

---

## Conclusion

This design specification provides a comprehensive guide to implementing a pixel-perfect UI that matches Claude's aesthetic. Key principles to remember:

1. **Simplicity**: Clean, minimal design with generous whitespace
2. **Consistency**: Use the design system tokens throughout
3. **Accessibility**: Ensure all users can access and use the interface
4. **Responsiveness**: Support all device sizes with mobile-first approach
5. **Performance**: Optimize for fast load times and smooth interactions

By following these specifications, you'll create an interface that feels natural to Claude users while providing powerful context management capabilities.

For questions or clarifications, refer to the individual component specifications and use the design tokens consistently throughout the implementation.
