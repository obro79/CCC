# Claude UI/UX Quick Reference

> Quick reference guide for implementing Claude-style interfaces in the Context Manager app

## Color Palette

### Brand Colors
```css
--brand-orange: #C15F3C;     /* Primary CTA, accents */
--blue-primary: #096BFF;      /* Links, highlights */
--blue-hover: #0056D6;        /* Hover states */
```

### Neutral Grays (naturalgray scale)
```css
--gray-50:  #f3f3f2;   /* Lightest backgrounds */
--gray-100: #e8e8e6;   /* Cards, panels */
--gray-200: #d3d3d0;   /* Borders, dividers */
--gray-300: #b8b8b4;   /* Disabled states */
--gray-500: #82827a;   /* Icons, labels */
--gray-700: #4c4c42;   /* Body text */
--gray-900: #1c1d22;   /* Headings, code blocks */
```

### Dark Mode
```css
--dark-bg: #1c1d22;           /* Main background */
--dark-surface: #25262b;      /* Cards, elevated */
--dark-text: #ffffff;         /* Primary text */
--dark-text-muted: #c1c2c5;  /* Secondary text */
```

## Typography

### Font Families
```css
--font-serif: ui-serif, Georgia, Cambria, 'Times New Roman', serif;
--font-sans: ui-sans-serif, system-ui;
--font-mono: 'Fira Code', Monaco, 'Courier New', monospace;
```

### Font Sizes
```css
--text-xs: 12px;
--text-sm: 14px;
--text-base: 16px;  /* Default */
--text-lg: 18px;
--text-xl: 20px;
--text-2xl: 24px;
--text-3xl: 30px;
```

## Spacing

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-6: 24px;
--space-8: 32px;
--space-12: 48px;
```

## Border Radius

```css
--radius-sm: 6px;   /* Buttons, small elements */
--radius-md: 8px;   /* Input fields */
--radius-lg: 12px;  /* Cards, panels */
--radius-xl: 16px;  /* Modals, large surfaces */
```

## Shadows

```css
--shadow-sm: 0 1px 3px 0 rgba(0,0,0,0.1);
--shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1);
--shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1);
```

## Component Patterns

### Primary Button
```tsx
<button className="
  bg-brand-orange text-white
  px-5 py-2.5 rounded-md
  font-semibold
  hover:bg-brand-orange/90
  active:scale-98
  transition-all duration-200
">
  Button Text
</button>
```

### Secondary Button
```tsx
<button className="
  bg-transparent text-gray-700
  border border-gray-300
  px-5 py-2.5 rounded-md
  hover:bg-gray-50
  transition-colors
">
  Button Text
</button>
```

### Input Field
```tsx
<input className="
  border border-gray-300 rounded-lg
  px-4 py-3 text-base
  focus:border-blue-primary
  focus:ring-4 focus:ring-blue-primary/10
  outline-none
  transition-all
" />
```

### Message Bubble (User)
```tsx
<div className="
  flex flex-row-reverse gap-3 mb-6
">
  <div className="
    bg-blue-primary text-white
    rounded-lg px-4 py-3
    max-w-[80%]
  ">
    {content}
  </div>
</div>
```

### Message Bubble (Assistant)
```tsx
<div className="flex gap-3 mb-6">
  <div className="w-8 h-8 rounded-full bg-gray-200" />
  <div className="
    bg-gray-100 text-gray-900
    rounded-lg px-4 py-3
    max-w-[80%]
  ">
    {content}
  </div>
</div>
```

### Code Block
```tsx
<div className="
  bg-gray-900 text-white
  rounded-lg p-4
  font-mono text-sm
  overflow-x-auto
  my-4
">
  <code>{code}</code>
</div>
```

### Card/Panel
```tsx
<div className="
  bg-white dark:bg-dark-surface
  border border-gray-200
  rounded-xl p-6
  shadow-sm
  hover:shadow-md
  transition-shadow
">
  {children}
</div>
```

### Loading Spinner (Typing Indicator)
```tsx
<div className="flex gap-1 p-4">
  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
</div>
```

## Layout Structure

### Desktop (3-column)
```
┌─────────┬─────────────────────┬──────────┐
│         │                     │          │
│ Sidebar │   Main Chat Area    │ Artifact │
│  (20%)  │       (50%)         │  Panel   │
│         │                     │  (30%)   │
└─────────┴─────────────────────┴──────────┘
```

### Tablet (2-column)
```
┌─────────┬─────────────────────┐
│         │                     │
│ Sidebar │   Main Chat Area    │
│  (30%)  │       (70%)         │
│         │                     │
└─────────┴─────────────────────┘
```

### Mobile (1-column)
```
┌─────────────────────────────┐
│      [☰] Top Nav Bar        │
├─────────────────────────────┤
│                             │
│      Main Chat Area         │
│         (100%)              │
│                             │
├─────────────────────────────┤
│      Bottom Input Bar       │
└─────────────────────────────┘
```

## Responsive Breakpoints

```css
/* Mobile: default */
/* Tablet: 768px */
@media (min-width: 768px) { ... }

/* Desktop: 1024px */
@media (min-width: 1024px) { ... }

/* Large Desktop: 1280px */
@media (min-width: 1280px) { ... }
```

## Animations

### Transition Timing
```css
/* Default */
transition-duration: 200ms;
transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);

/* Smooth */
transition-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);

/* Bounce */
transition-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### Common Animations
```css
/* Fade in */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide up */
@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Shimmer (loading) */
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

## Keyboard Shortcuts

```
Cmd/Ctrl + K      → Open command palette
Cmd/Ctrl + /      → Focus chat input
Cmd/Ctrl + N      → New conversation
Cmd/Ctrl + Shift + L  → Toggle theme
Esc               → Close modal
Enter             → Send message
Shift + Enter     → New line in input
```

## Accessibility

### Touch Targets
- Minimum: 44x44px
- Recommended: 48x48px

### Color Contrast
- Text on background: 4.5:1 minimum
- Large text (18px+): 3:1 minimum

### Focus States
```css
.focusable:focus-visible {
  outline: 2px solid var(--blue-primary);
  outline-offset: 2px;
}
```

## Tech Stack Recommendations

**Framework:** Next.js 14+ (App Router)
**Language:** TypeScript 5+
**Styling:** Tailwind CSS 3.4+
**Components:** shadcn/ui
**Icons:** Lucide React
**Markdown:** react-markdown + highlight.js
**State:** React Query + Zustand
**Animation:** Framer Motion

## Quick Tailwind Config

```typescript
// tailwind.config.ts
export default {
  darkMode: ['class'],
  theme: {
    extend: {
      colors: {
        naturalgray: {
          50: '#f3f3f2',
          100: '#e8e8e6',
          200: '#d3d3d0',
          300: '#b8b8b4',
          500: '#82827a',
          700: '#4c4c42',
          900: '#1c1d22',
        },
        brand: {
          orange: '#C15F3C',
        },
        blue: {
          primary: '#096BFF',
        }
      },
      borderRadius: {
        sm: '6px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
    },
  },
}
```

## Copy-Paste Starter Components

### Chat Container
```tsx
export function ChatContainer({ children }) {
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="border-b border-gray-200 px-6 py-4">
        <h1 className="text-xl font-semibold">Claude Code Context</h1>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto px-6 py-4">
        {children}
      </main>

      {/* Input */}
      <footer className="border-t border-gray-200 p-4">
        <textarea
          className="w-full rounded-lg border border-gray-300 p-3 resize-none"
          placeholder="Type a message..."
          rows={3}
        />
      </footer>
    </div>
  )
}
```

### Sidebar
```tsx
export function Sidebar({ conversations }) {
  return (
    <aside className="w-64 border-r border-gray-200 h-screen overflow-y-auto">
      <div className="p-4">
        <button className="w-full bg-brand-orange text-white rounded-lg py-2">
          New Conversation
        </button>
      </div>

      <nav className="px-2">
        {conversations.map(conv => (
          <button
            key={conv.id}
            className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100"
          >
            {conv.title}
          </button>
        ))}
      </nav>
    </aside>
  )
}
```

### Dark Mode Toggle
```tsx
'use client'

import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
    >
      <Sun className="h-5 w-5 dark:hidden" />
      <Moon className="h-5 w-5 hidden dark:block" />
    </button>
  )
}
```

---

**For full details, see:** `/claude-ui-design-patterns.md`
