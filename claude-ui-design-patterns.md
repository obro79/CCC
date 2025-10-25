# Claude Web Interface UI/UX Design Patterns

> Comprehensive research documentation on Claude.ai's interface design patterns, components, and visual system for building a Claude Code Context Manager web application.

**Date:** 2025-10-25
**Research Sources:** Official Anthropic documentation, community implementations, design system analysis, and third-party UI clones

---

## Table of Contents

1. [Layout & Navigation](#1-layout--navigation)
2. [Conversation Interface](#2-conversation-interface)
3. [Color Scheme & Design Tokens](#3-color-scheme--design-tokens)
4. [Component Patterns](#4-component-patterns)
5. [Interaction Patterns](#5-interaction-patterns)
6. [Responsive Design](#6-responsive-design)
7. [Technical Implementation](#7-technical-implementation)
8. [References & Resources](#8-references--resources)

---

## 1. Layout & Navigation

### Overall Page Structure

Claude.ai uses a clean, modern layout with a focus on clarity and user experience:

- **Three-column layout** (on desktop):
  - Left sidebar: Conversation history and navigation
  - Center panel: Main chat interface
  - Right panel: Artifacts preview (when applicable)

- **Mobile-first responsive approach**:
  - Breakpoints at 640px (sm), 768px (md), 1024px (lg), 1280px (xl)
  - Adaptive column configurations that collapse on smaller screens

### Sidebar Design

**Key Features:**
- Conversation history list with timestamps
- Model selection dropdown
- Settings and configuration access
- Dark/light mode toggle
- User account menu

**New "Claudia" Interface (in testing):**
- Shift towards a ChatGPT-like sidebar layout
- Persistent navigation that "sees" browsing context (in Chrome extension)
- Collapsible sidebar for more screen real estate

**Styling Characteristics:**
- Subtle hover states on conversation items
- Selected conversation highlighted with accent color
- Smooth expand/collapse animations
- Sticky header with user profile

### Header/Top Bar

**Components:**
- Model selector (Claude 3.5 Sonnet, etc.)
- New conversation button
- Share/export options
- User settings menu

**Design:**
- Minimal, unobtrusive design
- Clear visual hierarchy
- Fixed position with subtle bottom border
- Responsive to viewport width

### Conversation Organization

**Display Patterns:**
- Chronological ordering (newest first)
- Title auto-generation from conversation content
- Date/time grouping (Today, Yesterday, Last 7 days, etc.)
- Search and filter capabilities
- Archive and delete options

---

## 2. Conversation Interface

### Message Bubble Design

**User Messages:**
- Right-aligned layout
- Distinct background color (lighter in dark mode, darker in light mode)
- Rounded corners (typically 8-12px border radius)
- Adequate padding (16-24px)
- Clear visual separation from assistant messages

**Assistant Messages (Claude):**
- Left-aligned layout
- Neutral background color
- Same border radius as user messages for consistency
- May include avatar/icon on the left
- Support for rich content (markdown, code, images)

**Message Structure:**
```
┌─────────────────────────────────────┐
│ [Avatar] Assistant Name             │
│                                     │
│ Message content with markdown       │
│ support and **formatting**          │
│                                     │
│ [Action buttons: Copy, Edit, etc.]  │
└─────────────────────────────────────┘
```

### Typography and Spacing

**Font Stack:**
- **Primary:** Custom serif font (ui-serif, Georgia, Cambria, "Times New Roman", Times, serif)
  - Used for body text and readability
  - Traditional and formal aesthetic
  - Excellent readability across sizes

- **Logo/Branding:** Custom typeface `__copernicus_669e4a`
  - Bespoke serif design
  - Clean, modern with rounded humanistic feel
  - Understated and accessible

**Text Sizes:**
- xs (12px)
- sm (14px)
- base (16px) - default message text
- lg (18px)
- xl through 5xl for headings

**Spacing Patterns:**
- Tight letter spacing for improved readability
- Consistent line height (1.5-1.6 for body text)
- Vertical rhythm with 16-24px gaps between messages
- Adequate white space around interactive elements

### Code Block Styling

**Visual Treatment:**
- Dark background (#1c1d22 or similar) regardless of theme
- Syntax highlighting using highlight.js or similar
- Line numbers on the left (optional, can be toggled)
- Language label in top-right corner
- Copy button in top-right corner

**Layout:**
```
┌─────────────────────────────────────┐
│ language.ext           [Copy] [⋮]  │
├─────────────────────────────────────┤
│  1  const example = () => {         │
│  2    return "Hello World";         │
│  3  }                               │
└─────────────────────────────────────┘
```

**Styling Details:**
- Monospace font (typically 'Fira Code', 'Monaco', 'Courier New')
- Border radius: 6-8px
- Padding: 16px
- Horizontal scroll for long lines
- Responsive width (max-width: 100%)

### Tool Use and Thinking Blocks

**Thinking Blocks:**
- Collapsible/expandable sections
- Different background color (slightly muted)
- Icon indicator (brain/thought icon)
- Minimal by default, expandable on click

**Tool Use Display:**
- Clear visual indicator when tools are being used
- Tool name and parameters shown
- Results formatted appropriately (JSON, tables, etc.)
- Timestamp and execution duration

**Artifacts Feature:**
- Dedicated right panel for code/document preview
- Live preview of generated content
- Toggle between code view and rendered output
- Edit capabilities with text highlighting (new feature)
- Supports HTML, React components, SVG, and documents

### Markdown Rendering

**Best Practices (from Claude's system prompt):**
- Single space after hash symbols for headers
- Blank lines before and after headers, lists, and code blocks
- Consistent formatting for clarity
- Support for standard markdown elements:
  - Headers (h1-h6)
  - Bold, italic, strikethrough
  - Links and images
  - Blockquotes
  - Ordered and unordered lists
  - Tables
  - Horizontal rules

**Rendering Library:**
- Likely uses `markdown-it` or similar
- Custom CSS for styled elements
- Code highlighting integration

---

## 3. Color Scheme & Design Tokens

### Primary Color Palette

**Brand Colors:**
- **Primary Orange:** `#C15F3C` ("Crail")
  - Used for CTAs, accents, and highlights
  - Warm, professional, intellectually evocative
- **Off-white/Neutrals:** Light greys for backgrounds
- **Design Philosophy:** Calmness, professionalism, intellectual depth

**Extended Warm Palette:**
```css
#d4a37f  /* Warm beige */
#d8ac8c  /* Light warm beige */
#ddb599  /* Medium warm beige */
#e1bfa5  /* Lighter warm beige */
#e5c8b2  /* Very light warm beige */
#ead1be  /* Pale warm beige */
#eedacc  /* Light cream */
#f2e3d9  /* Very light cream */
#f6ede5  /* Extra light cream */
#fbf6f2  /* Off-white */
#ffffff  /* White */
```

**Temperature:** Warm, Neutral tones

### Neutral Gray Scale (naturalgray series)

Based on analysis of Claude's CSS and community implementations:

```css
--naturalgray-50:  #f3f3f2   /* Lightest - backgrounds */
--naturalgray-100: #e8e8e6   /* Very light - subtle borders */
--naturalgray-200: #d3d3d0   /* Light - borders, dividers */
--naturalgray-300: #b8b8b4   /* Medium-light - disabled states */
--naturalgray-400: #9d9d97   /* Medium - secondary text */
--naturalgray-500: #82827a   /* Base - icons, labels */
--naturalgray-600: #67675e   /* Medium-dark - body text */
--naturalgray-700: #4c4c42   /* Dark - headings */
--naturalgray-800: #313126   /* Darker - emphasis */
--naturalgray-900: #1c1d22   /* Darkest - code blocks */
```

### Blue Accent Colors

Used for links, interactive elements, and highlights:

```css
--blue-primary:   #096BFF  /* Main blue */
--blue-secondary: #3D86E6  /* Lighter blue */
--blue-hover:     #0056D6  /* Hover state */
--blue-muted:     #E3F0FF  /* Background tint */
```

### Dark Mode Colors

**Background Hierarchy:**
```css
--dark-bg-primary:    #1c1d22   /* Main background */
--dark-bg-secondary:  #25262b   /* Elevated surfaces */
--dark-bg-tertiary:   #2e2f35   /* Cards, panels */
--dark-bg-code:       #1a1b1f   /* Code blocks */
```

**Text Colors:**
```css
--dark-text-primary:   #ffffff   /* Headings, emphasis */
--dark-text-secondary: #c1c2c5   /* Body text */
--dark-text-tertiary:  #909296   /* Muted text */
--dark-text-disabled:  #5c5f66   /* Disabled states */
```

### Light Mode Colors

**Background Hierarchy:**
```css
--light-bg-primary:    #ffffff   /* Main background */
--light-bg-secondary:  #f8f9fa   /* Elevated surfaces */
--light-bg-tertiary:   #f1f3f5   /* Cards, panels */
--light-bg-code:       #f8f9fa   /* Code block backgrounds */
```

**Text Colors:**
```css
--light-text-primary:   #1c1d22   /* Headings, emphasis */
--light-text-secondary: #495057   /* Body text */
--light-text-tertiary:  #868e96   /* Muted text */
--light-text-disabled:  #ced4da   /* Disabled states */
```

### Border and Divider Styles

```css
--border-subtle:   1px solid var(--naturalgray-200)
--border-medium:   1px solid var(--naturalgray-300)
--border-emphasis: 1px solid var(--naturalgray-400)

/* Dark mode variants */
--dark-border-subtle:   1px solid rgba(255, 255, 255, 0.05)
--dark-border-medium:   1px solid rgba(255, 255, 255, 0.1)
--dark-border-emphasis: 1px solid rgba(255, 255, 255, 0.2)
```

### Shadows

```css
/* Light mode */
--shadow-xs:  0 1px 2px 0 rgba(0, 0, 0, 0.05)
--shadow-sm:  0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)
--shadow-md:  0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)
--shadow-lg:  0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)
--shadow-xl:  0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)

/* Dark mode - more subtle */
--dark-shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.3)
--dark-shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4)
--dark-shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.5)
```

---

## 4. Component Patterns

### Button Styles and Variants

**Primary Button (CTA):**
```css
background: #C15F3C (brand orange)
color: #ffffff
padding: 10px 20px
border-radius: 6px
font-weight: 600
transition: all 0.2s ease

hover: background: #a84f2f
active: background: #8f4226
```

**Secondary Button:**
```css
background: transparent
color: var(--text-primary)
border: 1px solid var(--naturalgray-300)
padding: 10px 20px
border-radius: 6px

hover: background: var(--naturalgray-50)
active: background: var(--naturalgray-100)
```

**Ghost Button:**
```css
background: transparent
color: var(--text-secondary)
padding: 8px 16px

hover: background: rgba(0, 0, 0, 0.05)
```

**Icon Button:**
```css
background: transparent
width: 36px
height: 36px
border-radius: 6px
display: flex
align-items: center
justify-content: center

hover: background: var(--naturalgray-100)
```

### Input Field Design

**Text Input:**
```css
border: 1px solid var(--naturalgray-300)
border-radius: 8px
padding: 12px 16px
font-size: 16px
transition: border-color 0.2s ease

focus:
  border-color: var(--blue-primary)
  outline: none
  box-shadow: 0 0 0 3px rgba(9, 107, 255, 0.1)
```

**Textarea (Chat Input):**
```css
min-height: 60px
max-height: 200px
resize: vertical
border-radius: 12px
padding: 16px
font-family: inherit

/* Auto-resize as user types */
overflow-y: auto
```

**Input with Icon:**
```css
position: relative

.icon {
  position: absolute
  left: 12px
  top: 50%
  transform: translateY(-50%)
  color: var(--text-tertiary)
}

.input {
  padding-left: 40px
}
```

### Card/Panel Designs

**Standard Card:**
```css
background: var(--bg-secondary)
border: 1px solid var(--naturalgray-200)
border-radius: 12px
padding: 20px 24px
box-shadow: var(--shadow-sm)

hover: box-shadow: var(--shadow-md)
transition: box-shadow 0.2s ease
```

**Artifact Panel:**
```css
background: var(--bg-primary)
border-left: 1px solid var(--naturalgray-200)
height: 100vh
overflow-y: auto
position: sticky
top: 0

/* Code/Preview toggle */
.toggle-buttons {
  display: flex
  gap: 4px
  padding: 8px
  background: var(--naturalgray-100)
  border-radius: 6px
}
```

**Glassmorphism Card (modern variant):**
```css
background: rgba(255, 255, 255, 0.1)
backdrop-filter: blur(10px)
border: 1px solid rgba(255, 255, 255, 0.2)
border-radius: 16px
box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1)
```

### Modal and Dialog Patterns

**Modal Overlay:**
```css
position: fixed
inset: 0
background: rgba(0, 0, 0, 0.5)
backdrop-filter: blur(2px)
display: flex
align-items: center
justify-content: center
z-index: 1000

/* Animation */
@keyframes fadeIn {
  from { opacity: 0 }
  to { opacity: 1 }
}
```

**Modal Content:**
```css
background: var(--bg-primary)
border-radius: 16px
padding: 32px
max-width: 600px
width: 90vw
max-height: 90vh
overflow-y: auto
box-shadow: var(--shadow-xl)

/* Slide up animation */
@keyframes slideUp {
  from {
    transform: translateY(20px)
    opacity: 0
  }
  to {
    transform: translateY(0)
    opacity: 1
  }
}
```

### Empty States

**No Conversations:**
```
┌─────────────────────────────────────┐
│                                     │
│         [Icon/Illustration]         │
│                                     │
│      Start a new conversation       │
│                                     │
│  Ask me anything or try one of     │
│  these suggestions:                │
│                                     │
│  [Suggestion Card]                  │
│  [Suggestion Card]                  │
│  [Suggestion Card]                  │
│                                     │
└─────────────────────────────────────┘
```

**Styling:**
```css
.empty-state {
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  padding: 48px 24px
  text-align: center
  color: var(--text-tertiary)
}

.empty-state-icon {
  width: 64px
  height: 64px
  margin-bottom: 16px
  opacity: 0.5
}

.empty-state-title {
  font-size: 20px
  font-weight: 600
  color: var(--text-primary)
  margin-bottom: 8px
}
```

### Loading States

**Typing Indicator:**
```css
.typing-indicator {
  display: flex
  gap: 4px
  padding: 16px
}

.dot {
  width: 8px
  height: 8px
  background: var(--naturalgray-400)
  border-radius: 50%
  animation: bounce 1.4s infinite ease-in-out
}

.dot:nth-child(1) { animation-delay: -0.32s }
.dot:nth-child(2) { animation-delay: -0.16s }

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0) }
  40% { transform: scale(1) }
}
```

**Skeleton Loader:**
```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--naturalgray-100) 0%,
    var(--naturalgray-200) 50%,
    var(--naturalgray-100) 100%
  )
  background-size: 200% 100%
  animation: shimmer 1.5s infinite
  border-radius: 4px
}

@keyframes shimmer {
  0% { background-position: 200% 0 }
  100% { background-position: -200% 0 }
}
```

---

## 5. Interaction Patterns

### Hover States

**Link Hover:**
```css
a {
  color: var(--blue-primary)
  text-decoration: none
  transition: color 0.2s ease
}

a:hover {
  color: var(--blue-hover)
  text-decoration: underline
}
```

**Card Hover:**
```css
.card {
  transform: translateY(0)
  box-shadow: var(--shadow-sm)
  transition: all 0.2s ease
}

.card:hover {
  transform: translateY(-2px)
  box-shadow: var(--shadow-lg)
}
```

**Button Hover:**
```css
.button {
  transform: scale(1)
  transition: transform 0.15s ease, background-color 0.2s ease
}

.button:hover {
  transform: scale(1.02)
}

.button:active {
  transform: scale(0.98)
}
```

### Click Interactions

**Ripple Effect (Material Design-inspired):**
```css
.ripple {
  position: relative
  overflow: hidden
}

.ripple::after {
  content: ''
  position: absolute
  border-radius: 50%
  background: rgba(255, 255, 255, 0.5)
  transform: scale(0)
  animation: ripple 0.6s ease-out
}

@keyframes ripple {
  to {
    transform: scale(4)
    opacity: 0
  }
}
```

**Toggle Switch:**
```css
.toggle {
  width: 44px
  height: 24px
  background: var(--naturalgray-300)
  border-radius: 12px
  position: relative
  cursor: pointer
  transition: background-color 0.3s ease
}

.toggle.active {
  background: var(--blue-primary)
}

.toggle-thumb {
  width: 20px
  height: 20px
  background: white
  border-radius: 50%
  position: absolute
  top: 2px
  left: 2px
  transition: transform 0.3s ease
}

.toggle.active .toggle-thumb {
  transform: translateX(20px)
}
```

### Keyboard Shortcuts

**Common Shortcuts:**
- `Cmd/Ctrl + K`: Open command palette
- `Cmd/Ctrl + /`: Focus chat input
- `Cmd/Ctrl + N`: New conversation
- `Cmd/Ctrl + Shift + L`: Toggle light/dark mode
- `Esc`: Close modal/dialog
- `Enter`: Send message (in chat)
- `Shift + Enter`: New line (in chat)

**Visual Hint:**
```css
.keyboard-hint {
  display: inline-flex
  align-items: center
  gap: 2px
  padding: 2px 6px
  background: var(--naturalgray-100)
  border: 1px solid var(--naturalgray-300)
  border-radius: 4px
  font-size: 12px
  font-family: monospace
  color: var(--text-secondary)
}
```

### Copy-to-Clipboard Patterns

**Copy Button:**
```css
.copy-button {
  opacity: 0
  transition: opacity 0.2s ease
}

.code-block:hover .copy-button {
  opacity: 1
}

.copy-button.copied {
  color: var(--success-color)
}

/* Icon swap on copy */
.copy-button .icon-copy { display: block }
.copy-button .icon-check { display: none }

.copy-button.copied .icon-copy { display: none }
.copy-button.copied .icon-check { display: block }
```

**Toast Notification:**
```css
.toast {
  position: fixed
  bottom: 24px
  right: 24px
  background: var(--naturalgray-800)
  color: white
  padding: 12px 20px
  border-radius: 8px
  box-shadow: var(--shadow-lg)
  animation: slideInUp 0.3s ease
}

@keyframes slideInUp {
  from {
    transform: translateY(100%)
    opacity: 0
  }
  to {
    transform: translateY(0)
    opacity: 1
  }
}
```

### Scrolling and Pagination

**Smooth Scroll:**
```css
html {
  scroll-behavior: smooth
}

/* Scroll to bottom on new message */
.chat-container {
  overflow-y: auto
  scroll-behavior: smooth
}

/* Scroll indicator */
.scroll-to-bottom {
  position: fixed
  bottom: 100px
  right: 24px
  background: white
  border: 1px solid var(--naturalgray-300)
  border-radius: 50%
  width: 40px
  height: 40px
  box-shadow: var(--shadow-md)
  opacity: 0
  transition: opacity 0.2s ease
}

.scroll-to-bottom.visible {
  opacity: 1
}
```

**Infinite Scroll:**
- Load more conversations as user scrolls up
- Spinner shown while loading
- Smooth insertion of new items
- Preserve scroll position after load

**Virtual Scrolling:**
- For very long conversations (1000+ messages)
- Render only visible messages + buffer
- Libraries like `react-window` or `react-virtualized`

---

## 6. Responsive Design

### Mobile Layout Adaptations

**Breakpoint Strategy:**
```css
/* Mobile first approach */
.container {
  width: 100%
  padding: 16px
}

/* Tablet (768px+) */
@media (min-width: 768px) {
  .container {
    padding: 24px
    max-width: 768px
    margin: 0 auto
  }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  .container {
    max-width: 1200px
    padding: 32px
  }

  .sidebar {
    display: block /* Show sidebar */
  }
}

/* Large Desktop (1280px+) */
@media (min-width: 1280px) {
  .container {
    max-width: 1400px
  }

  .artifacts-panel {
    display: block /* Show artifacts panel */
  }
}
```

**Mobile-Specific Patterns:**

1. **Collapsible Sidebar:**
   - Hidden by default on mobile
   - Accessible via hamburger menu
   - Slide-in animation from left
   - Overlay backdrop when open

2. **Bottom Sheet Input:**
   - Chat input fixed to bottom on mobile
   - Expands when focused
   - Send button more prominent

3. **Single Column Layout:**
   - No artifacts panel on mobile
   - Full-screen artifact view on tap
   - Back button to return to chat

4. **Touch-Optimized Buttons:**
   - Minimum 44x44px touch targets
   - Increased spacing between interactive elements
   - Larger tap areas for small icons

**Mobile Navigation:**
```css
.mobile-nav {
  position: fixed
  bottom: 0
  left: 0
  right: 0
  background: var(--bg-primary)
  border-top: 1px solid var(--naturalgray-200)
  padding: 12px
  display: flex
  justify-content: space-around
  z-index: 100
}

@media (min-width: 768px) {
  .mobile-nav {
    display: none /* Hide on tablet+ */
  }
}
```

### Touch-Friendly Interactions

**Swipe Gestures:**
- Swipe left on conversation: Delete/archive
- Swipe right: Reply/share
- Pull to refresh: Reload conversations
- Swipe down on artifact: Close

**Long Press:**
- Long press message: Show context menu
- Long press code block: Quick copy
- Long press conversation: Bulk select mode

**Tap Interactions:**
```css
/* Prevent 300ms tap delay on mobile */
* {
  touch-action: manipulation
}

/* Larger touch targets */
.touch-target {
  min-width: 44px
  min-height: 44px
  padding: 12px
}

/* Feedback on touch */
.touchable {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0.05)
}

.touchable:active {
  opacity: 0.7
}
```

### Tablet Adaptations

**Two-Column Layout (768px - 1023px):**
- Sidebar visible (collapsible)
- Main chat content
- Artifacts in modal/overlay (not persistent panel)

**Hybrid Navigation:**
- Top bar with key actions
- Optional bottom bar for frequent tasks
- Sidebar for conversation history

---

## 7. Technical Implementation

### Recommended Tech Stack

Based on analysis of Claude clones and modern best practices:

**Frontend Framework:**
- **Next.js 14+** with App Router
- **React 18+** for component architecture
- **TypeScript 5+** for type safety

**Styling:**
- **Tailwind CSS 3.4+** for utility-first styling
- **shadcn/ui** for pre-built, customizable components
- PostCSS for additional processing

**State Management:**
- **React Query** (TanStack Query) for server state
- **Zustand** or **Context API** for client state
- **React Hook Form** for form handling

**UI Components:**
- **shadcn/ui** - Accessible, customizable React components
- **Radix UI** - Unstyled, accessible component primitives
- **Lucide React** - Icon library
- **Recharts** - Data visualization

**Markdown & Code:**
- **markdown-it** - Fast markdown parser
- **highlight.js** or **Prism** - Syntax highlighting
- **react-markdown** - React wrapper for markdown rendering
- **react-syntax-highlighter** - Code highlighting in React

**Additional Libraries:**
- **Framer Motion** - Animation library
- **react-hot-toast** - Toast notifications
- **react-virtualized** or **react-window** - Virtual scrolling
- **react-dropzone** - File upload handling

### Project Structure

```
/app                      # Next.js App Router
  /(auth)                # Auth-related pages
  /(dashboard)           # Main app pages
  /api                   # API routes
/components              # React components
  /ui                    # shadcn/ui components
  /chat                  # Chat-specific components
  /layout                # Layout components
  /artifacts             # Artifact viewer components
/hooks                   # Custom React hooks
/lib                     # Utility functions
  /api                   # API client
  /utils                 # Helper functions
/styles                  # Global styles & Tailwind config
/types                   # TypeScript type definitions
/public                  # Static assets
/tests                   # Test files
```

### Component Architecture Example

```typescript
// components/chat/message-bubble.tsx
import React from 'react'
import { cn } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface MessageBubbleProps {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  avatar?: string
}

export function MessageBubble({
  role,
  content,
  timestamp,
  avatar
}: MessageBubbleProps) {
  const isUser = role === 'user'

  return (
    <div className={cn(
      'flex gap-3 mb-6',
      isUser ? 'flex-row-reverse' : 'flex-row'
    )}>
      {/* Avatar */}
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-naturalgray-200 flex items-center justify-center flex-shrink-0">
          {avatar || 'C'}
        </div>
      )}

      {/* Message Content */}
      <div className={cn(
        'max-w-[80%] rounded-lg px-4 py-3',
        isUser
          ? 'bg-blue-primary text-white'
          : 'bg-naturalgray-100 text-naturalgray-900'
      )}>
        <ReactMarkdown
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '')
              return !inline && match ? (
                <SyntaxHighlighter
                  style={oneDark}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              )
            }
          }}
        >
          {content}
        </ReactMarkdown>

        <div className="text-xs opacity-60 mt-2">
          {timestamp.toLocaleTimeString()}
        </div>
      </div>
    </div>
  )
}
```

### Styling Configuration

**tailwind.config.ts:**
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        naturalgray: {
          50: '#f3f3f2',
          100: '#e8e8e6',
          200: '#d3d3d0',
          300: '#b8b8b4',
          400: '#9d9d97',
          500: '#82827a',
          600: '#67675e',
          700: '#4c4c42',
          800: '#313126',
          900: '#1c1d22',
        },
        blue: {
          primary: '#096BFF',
          secondary: '#3D86E6',
          hover: '#0056D6',
          muted: '#E3F0FF',
        },
        brand: {
          orange: '#C15F3C',
          'orange-hover': '#a84f2f',
          'orange-active': '#8f4226',
        }
      },
      borderRadius: {
        lg: '12px',
        md: '8px',
        sm: '6px',
      },
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'sm': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui'],
        serif: ['ui-serif', 'Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
        mono: ['Fira Code', 'Monaco', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
  ],
}

export default config
```

### Animation Examples

**Framer Motion - Message Entry:**
```typescript
import { motion } from 'framer-motion'

export function AnimatedMessage({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      {children}
    </motion.div>
  )
}
```

**CSS Transitions - Smooth Interactions:**
```css
/* Global smooth transitions */
* {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Custom easing curves */
.ease-smooth {
  transition-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);
}

.ease-bounce {
  transition-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```

### Dark Mode Implementation

```typescript
// app/providers.tsx
'use client'

import { ThemeProvider } from 'next-themes'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  )
}

// components/theme-toggle.tsx
'use client'

import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-md hover:bg-naturalgray-100 dark:hover:bg-naturalgray-800"
    >
      <Sun className="h-5 w-5 dark:hidden" />
      <Moon className="h-5 w-5 hidden dark:block" />
    </button>
  )
}
```

---

## 8. References & Resources

### Official Sources

1. **Anthropic Documentation**
   - Claude Docs: https://docs.anthropic.com
   - Claude Code Docs: https://docs.claude.com/en/docs/claude-code

2. **Anthropic Design System**
   - Geist Agency - Anthropic Branding: https://geist.co/work/anthropic
   - Brand Color Codes: https://beginswithai.com/claude-ai-logo-color-codes-fonts-downloadable-assets/

### Open Source Implementations

1. **Claude UI Clone (Nuxt.js)**
   - GitHub: https://github.com/chihebnabil/claude-ui
   - Tech: Nuxt 3, Vue, Drizzle ORM, markdown-it, highlight.js

2. **Anthropic GUI (React)**
   - GitHub: https://github.com/ezetech/anthropic-gui
   - Tech: React, TypeScript, SCSS

3. **Claude Artifact Runner**
   - GitHub: https://github.com/claudio-silva/claude-artifact-runner
   - Tech: React 18, TypeScript, Vite, Tailwind, shadcn/ui

4. **Anthropic Claude Clone (Next.js + Langchain)**
   - GitHub: https://github.com/developersdigest/Anthropic-Claude-Clone-in-Next.JS-and-Langchain

### Design Resources

1. **UI Component Library**
   - shadcn/ui: https://ui.shadcn.com
   - Radix UI: https://www.radix-ui.com

2. **Icon Libraries**
   - Lucide React: https://lucide.dev
   - Heroicons: https://heroicons.com

3. **Color Palette Tools**
   - Anthropic Palette: https://colorswall.com/palette/340255
   - Tailwind Colors: https://tailwindcss.com/docs/customizing-colors

### Technical References

1. **Next.js Documentation**
   - App Router Guide: https://nextjs.org/docs/app
   - TypeScript: https://nextjs.org/docs/app/building-your-application/configuring/typescript

2. **Tailwind CSS**
   - Documentation: https://tailwindcss.com/docs
   - Typography Plugin: https://tailwindcss.com/docs/typography-plugin

3. **React Query**
   - Documentation: https://tanstack.com/query/latest
   - Patterns: https://tkdodo.eu/blog/practical-react-query

4. **Markdown & Syntax Highlighting**
   - markdown-it: https://markdown-it.github.io
   - react-markdown: https://github.com/remarkjs/react-markdown
   - highlight.js: https://highlightjs.org
   - Prism: https://prismjs.com

### Community Resources

1. **PureCode.ai Claude Clone Template**
   - URL: https://purecode.ai/community/claudeaiclonechat-tailwind-chatinterfaceclaudeai

2. **Next.js + TypeScript + Tailwind + shadcn Guide**
   - GitHub Gist: https://gist.github.com/gregsantos/2fc7d7551631b809efa18a0bc4debd2a

3. **Claude Artifacts Implementation Guide**
   - LogRocket: https://blog.logrocket.com/implementing-claudes-artifacts-feature-ui-visualization/

### Design Inspiration

1. **Anthropic UI Screens**
   - nicelydone.club: https://nicelydone.club/apps/anthropic
   - 140 UI screens, 24 marketing screens, 6 UI components

2. **Claude Component Examples**
   - nicelydone.club: https://nicelydone.club/apps/claude/components
   - 218 UI screens, 11 marketing screens, 24 UI components

---

## Key Takeaways for Claude Code Context Manager

### Design Principles to Follow

1. **Clean & Minimal:** Focus on content, reduce visual noise
2. **Professional Warmth:** Use warm neutrals with thoughtful accents
3. **Accessibility First:** High contrast, keyboard navigation, ARIA labels
4. **Responsive by Default:** Mobile-first approach with adaptive layouts
5. **Smooth Interactions:** Subtle animations, clear feedback

### Color Palette Recommendation

```css
/* Primary Colors */
--brand-primary: #C15F3C;        /* Anthropic orange */
--brand-secondary: #096BFF;      /* Blue accent */

/* Neutrals (naturalgray) */
--gray-50: #f3f3f2;
--gray-100: #e8e8e6;
--gray-900: #1c1d22;

/* Semantic Colors */
--success: #10b981;
--warning: #f59e0b;
--error: #ef4444;
--info: #3b82f6;
```

### Typography Scale

```css
/* Headings */
--text-5xl: 48px;  /* Page titles */
--text-4xl: 36px;  /* Section headers */
--text-3xl: 30px;
--text-2xl: 24px;
--text-xl: 20px;

/* Body */
--text-lg: 18px;
--text-base: 16px;  /* Default */
--text-sm: 14px;
--text-xs: 12px;
```

### Spacing System

```css
/* Use consistent 4px base unit */
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-6: 24px;
--space-8: 32px;
--space-12: 48px;
--space-16: 64px;
```

### Border Radius

```css
--radius-sm: 6px;   /* Buttons, inputs */
--radius-md: 8px;   /* Cards, small panels */
--radius-lg: 12px;  /* Large panels, modals */
--radius-xl: 16px;  /* Hero sections */
--radius-full: 9999px;  /* Pills, avatars */
```

---

**Document Version:** 1.0
**Last Updated:** 2025-10-25
**Maintained by:** Claude Code Research Team

For questions or updates, refer to the official Anthropic documentation and community resources listed above.
