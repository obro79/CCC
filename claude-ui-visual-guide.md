# Claude UI Visual Design Guide

> Visual reference with ASCII diagrams and component examples

## Layout Anatomy

### Desktop Layout (1280px+)
```
┌──────────────────────────────────────────────────────────────────────────────┐
│  Top Bar                                      [User] [Settings] [Theme]      │
│  Claude Code Context Manager                                                 │
├────────┬─────────────────────────────────────────────────┬───────────────────┤
│        │                                                 │                   │
│ SIDEBAR│              MAIN CHAT AREA                     │  ARTIFACTS PANEL  │
│        │                                                 │                   │
│ [New]  │  ┌─────────────────────────────────────┐      │  ┌──────────────┐ │
│        │  │ [C] Hi, how can I help?             │      │  │ Preview      │ │
│ Recent │  │     10:23 AM                         │      │  │              │ │
│ Conv 1 │  └─────────────────────────────────────┘      │  │ [Code View]  │ │
│ Conv 2 │                                                │  │              │ │
│ Conv 3 │  ┌─────────────────────────────────────┐      │  │              │ │
│        │  │ Help me build a component      [Me] │      │  │              │ │
│ Archive│  │                         10:24 AM     │      │  │              │ │
│        │  └─────────────────────────────────────┘      │  │              │ │
│        │                                                │  └──────────────┘ │
│        │  ┌─────────────────────────────────────┐      │                   │
│ [Dark] │  │ [C] Here's a component:             │      │  [Copy] [Edit]    │
│        │  │                                      │      │                   │
│        │  │  ```tsx                              │      │                   │
│        │  │  export function Card() {            │      │                   │
│        │  │    return <div>...</div>             │      │                   │
│        │  │  }                                   │      │                   │
│        │  │  ```                                 │      │                   │
│        │  │                         10:24 AM     │      │                   │
│        │  └─────────────────────────────────────┘      │                   │
│        │                                                │                   │
│        │  ┌──────────────────────────────────┐         │                   │
│        │  │ ● ● ●  Claude is typing...       │         │                   │
│        │  └──────────────────────────────────┘         │                   │
│        ├─────────────────────────────────────────────────┤                   │
│        │ ┌────────────────────────────────────────┐   │                   │
│        │ │ Type a message...                      │   │                   │
│        │ │                                  [Send]│   │                   │
│        │ └────────────────────────────────────────┘   │                   │
├────────┴─────────────────────────────────────────────────┴───────────────────┤
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘

  20%          50%                                           30%
Sidebar     Main Chat                                    Artifacts
```

### Tablet Layout (768px - 1023px)
```
┌────────────────────────────────────────────────────────┐
│  [☰] Claude Code Context         [User] [⚙] [Theme]   │
├────────┬───────────────────────────────────────────────┤
│        │                                               │
│ SIDEBAR│         MAIN CHAT AREA                        │
│        │                                               │
│ [New]  │  ┌─────────────────────────────────────┐     │
│        │  │ [C] Hi, how can I help?             │     │
│ Conv 1 │  └─────────────────────────────────────┘     │
│ Conv 2 │                                               │
│ Conv 3 │  ┌─────────────────────────────────────┐     │
│        │  │ Help me build a component      [Me] │     │
│ [Dark] │  └─────────────────────────────────────┘     │
│        │                                               │
│        │  [Artifacts shown in modal when clicked]     │
│        │                                               │
│        ├───────────────────────────────────────────────┤
│        │ ┌──────────────────────────────────────┐    │
│        │ │ Type a message...              [Send]│    │
│        │ └──────────────────────────────────────┘    │
└────────┴───────────────────────────────────────────────┘

  30%                    70%
Sidebar              Main Chat
(collapsible)
```

### Mobile Layout (< 768px)
```
┌──────────────────────────────────────┐
│  [☰]  Claude Code    [⚙] [Theme]    │
├──────────────────────────────────────┤
│                                      │
│        MAIN CHAT AREA                │
│                                      │
│  ┌────────────────────────────────┐ │
│  │ [C] Hi, how can I help?        │ │
│  │     10:23 AM                    │ │
│  └────────────────────────────────┘ │
│                                      │
│  ┌────────────────────────────────┐ │
│  │ Help me         [Me]           │ │
│  │          10:24 AM              │ │
│  └────────────────────────────────┘ │
│                                      │
│  ┌────────────────────────────────┐ │
│  │ [C] Here's how...              │ │
│  │                                 │ │
│  │  ```tsx                         │ │
│  │  code here                      │ │
│  │  ```                            │ │
│  │              10:24 AM           │ │
│  └────────────────────────────────┘ │
│                                      │
│  [Tap to view artifacts full screen]│
│                                      │
├──────────────────────────────────────┤
│ ┌──────────────────────────────┐   │
│ │ Type...              [Send]  │   │
│ └──────────────────────────────┘   │
├──────────────────────────────────────┤
│  [Chat] [History] [Settings] [+]    │
└──────────────────────────────────────┘

Bottom Navigation Bar (Fixed)
```

## Message Bubble Anatomy

### User Message
```
                    ┌─────────────────────────────┐
                    │ Help me build a React       │
                    │ component with TypeScript   │
                    │                             │
                    │                     10:24 AM│
                    └─────────────────────────────┘
                                            [Avatar]

bg-blue-primary (#096BFF)
text-white
rounded-lg (12px)
padding: 12px 16px
max-width: 80%
align: flex-row-reverse
```

### Assistant Message
```
[C] ┌─────────────────────────────────────┐
    │ I'll help you build a TypeScript    │
    │ React component. Here's an example: │
    │                                     │
    │ ```tsx                              │
    │ export function Component() {       │
    │   return <div>Hello</div>          │
    │ }                                   │
    │ ```                                 │
    │                                     │
    │ 10:24 AM              [Copy] [···]  │
    └─────────────────────────────────────┘

Avatar: 32px circle, bg-gray-200
bg-gray-100 (light) / bg-gray-800 (dark)
text-gray-900 (light) / text-white (dark)
rounded-lg (12px)
padding: 12px 16px
max-width: 80%
align: flex-row
```

### Code Block in Message
```
┌────────────────────────────────────────────┐
│ TypeScript                    [Copy] [···] │ ← Header
├────────────────────────────────────────────┤
│  1  export function Card({                 │
│  2    title,                               │
│  3    children                             │ ← Line numbers
│  4  }: CardProps) {                        │   (optional)
│  5    return (                             │
│  6      <div className="card">             │
│  7        <h2>{title}</h2>                 │
│  8        {children}                       │
│  9      </div>                             │
│ 10    )                                    │
│ 11  }                                      │
└────────────────────────────────────────────┘

bg: #1c1d22 (always dark, regardless of theme)
text: syntax-highlighted with highlight.js
font-family: 'Fira Code', Monaco, monospace
font-size: 14px
border-radius: 8px
padding: 16px
overflow-x: auto
```

## Component Visual Specs

### Button Variants

#### Primary Button
```
┌─────────────────┐
│  Create Project │  ← bg-brand-orange (#C15F3C)
└─────────────────┘     text-white, font-semibold
                        padding: 10px 20px
    hover:                 border-radius: 6px
┌─────────────────┐     transition: 200ms
│  Create Project │  ← bg-orange/90
└─────────────────┘     transform: scale(1.02)
```

#### Secondary Button
```
┌─────────────────┐
│     Cancel      │  ← bg-transparent
└─────────────────┘     border: 1px solid gray-300
                        text-gray-700
    hover:
┌─────────────────┐
│     Cancel      │  ← bg-gray-50
└─────────────────┘
```

#### Ghost Button
```
  View Details      ← bg-transparent, text-gray-600

hover:
┌─────────────────┐
│  View Details   │  ← bg-gray-50/50
└─────────────────┘
```

#### Icon Button
```
┌────┐
│ ⚙  │  ← 36x36px, rounded-md (8px)
└────┘     bg-transparent

hover:
┌────┐
│ ⚙  │  ← bg-gray-100
└────┘
```

### Input Fields

#### Text Input
```
┌────────────────────────────────────┐
│ Enter your message...              │  ← Default state
└────────────────────────────────────┘     border: 1px solid gray-300
                                           padding: 12px 16px
                                           border-radius: 8px

┌────────────────────────────────────┐
│ This is my message█                │  ← Focus state
└────────────────────────────────────┘     border-color: blue-primary
    ╰──────────────────────────────╯        ring: 4px blue-primary/10
     glow effect (focus ring)
```

#### Textarea (Chat Input)
```
┌──────────────────────────────────────────┐
│ Type a message...                        │
│                                          │  ← min-height: 60px
│                                    [📎]  │    max-height: 200px
└──────────────────────────────────────────┘    auto-resize on type
                                                rounded-xl (12px)
┌──────────────────────────────────────────┐    padding: 16px
│ This is a longer message that wraps      │
│ to multiple lines automatically as       │
│ the user types more content        [📎]  │
└──────────────────────────────────────────┘
```

#### Search Input
```
┌──────────────────────────────────────────┐
│  🔍  Search conversations...             │
└──────────────────────────────────────────┘

Icon: position absolute, left 12px
Input: padding-left: 40px
```

### Card Designs

#### Standard Card
```
┌────────────────────────────────────────────┐
│  Card Title                                │  ← bg-white (light)
│                                            │     bg-gray-800 (dark)
│  Card content goes here with proper        │     border: 1px gray-200
│  spacing and typography. This is the       │     border-radius: 12px
│  body text area.                           │     padding: 20px 24px
│                                            │     shadow-sm
│  [Action Button]                           │
└────────────────────────────────────────────┘
                                                  hover: shadow-md
```

#### Glassmorphism Card (Modern)
```
┌────────────────────────────────────────────┐
│╭╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╮│
││  Feature Card                            ││  ← bg: rgba(255,255,255,0.1)
││                                          ││     backdrop-filter: blur(10px)
││  Semi-transparent background with        ││     border: rgba(255,255,255,0.2)
││  frosted glass effect.                   ││     border-radius: 16px
││                                          ││     shadow: 0 8px 32px rgba(0,0,0,0.1)
│╰╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╯│
└────────────────────────────────────────────┘
```

### Modal/Dialog

#### Standard Modal
```
     ╔════════════════════════════════════════╗
     ║                                        ║
     ║  Dialog Title                    [×]   ║
     ║  ────────────────────────────────────  ║
     ║                                        ║  ← bg-white (light)
     ║  Dialog content and form fields        ║     bg-gray-900 (dark)
     ║  go here. This modal is centered       ║     max-width: 600px
     ║  on the screen with an overlay.        ║     border-radius: 16px
     ║                                        ║     padding: 32px
     ║                                        ║     shadow-xl
     ║                        [Cancel] [Save] ║
     ║                                        ║
     ╚════════════════════════════════════════╝

Background overlay:
rgba(0, 0, 0, 0.5) + backdrop-filter: blur(2px)
```

### Loading States

#### Typing Indicator
```
┌──────────────────────┐
│  ● ● ●               │  ← 3 dots bouncing
└──────────────────────┘     animation-delay staggered

Animation keyframes:
  0%   ●  ●  ●
  40%  ⬤  ●  ●
  80%  ●  ●  ●
  (repeats with different dots)

Dot size: 8px circle
Color: gray-400
Gap: 4px
```

#### Skeleton Loader
```
┌────────────────────────────────────────────┐
│ ████████████                               │  ← Shimmer effect
│ ████████                                   │     gray-100 → gray-200 → gray-100
│                                            │     animation: 1.5s infinite
│ ██████████████████                         │     border-radius: 4px
│ ████████████████████████                   │
└────────────────────────────────────────────┘
```

#### Progress Bar
```
┌────────────────────────────────────────────┐
│ ████████████████░░░░░░░░░░░░░░░░░░░░░░░░  │  45%
└────────────────────────────────────────────┘

bg: gray-200 (track)
fill: blue-primary (progress)
height: 8px
border-radius: 4px
transition: width 300ms ease
```

### Empty States

#### No Conversations
```
            ┌────────────────────────────────┐
            │                                │
            │         ┌──────────┐          │
            │         │          │          │
            │         │    💬    │          │  ← Icon 64x64px
            │         │          │          │     opacity: 0.5
            │         └──────────┘          │
            │                                │
            │   Start a new conversation     │  ← text-xl, font-semibold
            │                                │
            │   Ask me anything or try       │  ← text-gray-600
            │   one of these suggestions:    │
            │                                │
            │   ┌────────────────────────┐  │
            │   │  💡 Explain a concept  │  │  ← Suggestion cards
            │   └────────────────────────┘  │
            │                                │
            │   ┌────────────────────────┐  │
            │   │  🎨 Create a design    │  │
            │   └────────────────────────┘  │
            │                                │
            └────────────────────────────────┘

Centered flex container
padding: 48px 24px
text-align: center
```

## Spacing System Visual

```
Base Unit: 4px

space-1   ━     4px
space-2   ━━    8px
space-3   ━━━   12px
space-4   ━━━━  16px   ← Default gap between elements
space-6   ━━━━━━ 24px  ← Section spacing
space-8   ━━━━━━━━ 32px ← Large section spacing
space-12  ━━━━━━━━━━━━ 48px ← Page section spacing
space-16  ━━━━━━━━━━━━━━━━ 64px ← Hero spacing

Example usage:
┌─────────────────┐
│ Element         │ ← padding: space-4 (16px)
└─────────────────┘
      ━━━━          ← margin-bottom: space-4
┌─────────────────┐
│ Element         │
└─────────────────┘
```

## Border Radius Visual

```
radius-sm (6px)    ┌──┐
Small elements     │  │
                   └──┘

radius-md (8px)    ┌───┐
Input fields       │   │
                   └───┘

radius-lg (12px)   ┌────┐
Cards, panels      │    │
                   └────┘

radius-xl (16px)   ┌─────┐
Modals, large      │     │
surfaces           └─────┘

radius-full        ╭─────╮
Pills, avatars     ╰─────╯
```

## Shadow Depth Visual

```
shadow-xs    ▔▔▔▔▔▔▔▔
(Very subtle) Barely visible

shadow-sm    ┏━━━━━━━┓
             ┃       ┃  Subtle depth
             ┗━━━━━━━┛

shadow-md    ┏━━━━━━━┓
             ┃       ┃  Medium depth
             ┗━━━━━━━┛
              ▔▔▔▔▔▔▔

shadow-lg    ┏━━━━━━━┓
             ┃       ┃  Elevated
             ┗━━━━━━━┛
               ▔▔▔▔▔▔▔

shadow-xl    ┏━━━━━━━┓
             ┃       ┃  Floating
             ┗━━━━━━━┛
                ▔▔▔▔▔▔▔
```

## Color Palette Visual

### Light Mode
```
┌─────────┬─────────┬─────────┬─────────┬─────────┐
│ gray-50 │gray-100 │gray-200 │gray-300 │gray-500 │
│#f3f3f2  │#e8e8e6  │#d3d3d0  │#b8b8b4  │#82827a  │
│  ░░░    │  ░░     │  ░      │  ▒      │  ▓      │
└─────────┴─────────┴─────────┴─────────┴─────────┘

┌─────────┬─────────┬─────────┐
│gray-700 │gray-900 │  blue   │
│#4c4c42  │#1c1d22  │#096BFF  │
│  █      │  ██     │  🔵     │
└─────────┴─────────┴─────────┘

Usage:
gray-50/100:   Backgrounds, subtle surfaces
gray-200/300:  Borders, dividers
gray-500:      Icons, labels
gray-700/900:  Text, emphasis
blue:          Links, highlights, CTAs
```

### Dark Mode
```
┌─────────┬─────────┬─────────┬─────────┐
│   bg    │ surface │  card   │  text   │
│#1c1d22  │#25262b  │#2e2f35  │#ffffff  │
│  ███    │  ██     │  █      │  ░░░    │
└─────────┴─────────┴─────────┴─────────┘

Hierarchy:
bg (darkest) → surface → card → text (lightest)
```

## Typography Scale Visual

```
5xl (48px)  ▓▓▓▓▓ Page Titles
4xl (36px)  ▓▓▓▓ Section Headers
3xl (30px)  ▓▓▓ Large Headings
2xl (24px)  ▓▓ Subheadings
xl (20px)   ▓ Small Headings

lg (18px)   █ Large Body
base (16px) █ Default Body Text
sm (14px)   ▒ Small Text, Captions
xs (12px)   ░ Tiny Text, Labels
```

## Interaction States

### Button States
```
Default        Hover          Active         Disabled
┌─────┐       ┏━━━━━┓       ┏━━━━━┓       ┌ ─ ─ ─┐
│Click│   →   ┃Click┃   →   ┃Click┃       │ Click │
└─────┘       ┗━━━━━┛       ┗━━━━━┛       └ ─ ─ ─┘
scale(1)      scale(1.02)   scale(0.98)   opacity:0.5

Transitions: transform 150ms, background 200ms
```

### Toggle Switch
```
OFF State               ON State
┌──────┐               ┌──────┐
│ ○    │   click →     │    ● │
└──────┘               └──────┘
gray-300               blue-primary

Thumb animation: transform 300ms ease
Background: transition 300ms ease
```

### Hover Effects
```
Card Elevation:
┌────────┐          ┌────────┐
│        │  hover   │        │
│  Card  │   →      │  Card  │
└────────┘          └────────┘
  ▁▁▁▁▁▁              ▂▂▂▂▂▂
shadow-sm           shadow-lg
translateY(0)       translateY(-2px)
```

## Responsive Breakpoints Visual

```
Mobile          Tablet          Desktop         Large Desktop
< 768px         768-1023px      1024-1279px     1280px+

│               │               │               │
│    Phone      │    iPad       │    Laptop     │    Monitor
│   Portrait    │               │               │
│               │               │               │
│    ┌───┐     │   ┌───────┐   │  ┌─────────┐  │ ┌────────────┐
│    │   │     │   │       │   │  │         │  │ │            │
│    │   │     │   │       │   │  │         │  │ │            │
│    └───┘     │   └───────┘   │  └─────────┘  │ └────────────┘
│              │               │               │
│  1 column    │  2 columns    │  2-3 columns  │  3 columns
│  Stack all   │  Sidebar +    │  Sidebar +    │  Sidebar +
│              │  Main         │  Main + Panel │  Main + Panel
```

## Accessibility Visual Guide

### Touch Targets
```
❌ Too Small (< 44px)       ✅ Good (44x44px)         ✅ Better (48x48px)
┌──┐                       ┌────┐                   ┌─────┐
│  │                       │    │                   │     │
└──┘                       └────┘                   └─────┘
32px                       44px                     48px
```

### Color Contrast
```
❌ Poor Contrast            ✅ Good Contrast
┌─────────────────┐        ┌─────────────────┐
│ gray text       │        │ Dark text       │
│ on gray bg      │        │ on white bg     │
└─────────────────┘        └─────────────────┘
1.5:1                      4.5:1+
```

### Focus Indicators
```
No Focus (bad)             Clear Focus (good)
┌─────────┐               ┏━━━━━━━━━┓
│ Button  │               ┃ Button  ┃  ← 2px outline
└─────────┘               ┗━━━━━━━━━┛     offset: 2px
                            ╰───────╯      color: blue-primary
```

## Animation Timing Visual

```
Fast (100ms)     Quick interactions, micro-feedback
═══════>

Medium (200ms)   Default transitions, hover states
═════════════>

Slow (300ms)     Smooth animations, toggles
═══════════════════>

Very Slow (600ms) Page transitions, complex animations
═════════════════════════════════════════>

Timing Functions:
ease            ╱───╲      Default, smooth
ease-in         ╱───       Acceleration
ease-out        ───╲       Deceleration
ease-in-out     ╱──╲       Smooth both ends
```

---

**Quick Tips:**

1. **Consistent Spacing:** Use multiples of 4px (space-1 through space-16)
2. **Color Hierarchy:** Lighter for backgrounds, darker for text
3. **Border Radius:** Smaller (6-8px) for small elements, larger (12-16px) for cards
4. **Shadows:** Subtle on hover, more prominent for modals
5. **Transitions:** 200ms is the sweet spot for most interactions
6. **Touch Targets:** Minimum 44x44px, preferably 48x48px
7. **Typography:** 16px base, scale up/down from there
8. **Contrast:** 4.5:1 for body text, 3:1 for large text (18px+)

**For implementation details, see:**
- Full guide: `/claude-ui-design-patterns.md`
- Quick reference: `/claude-ui-quick-reference.md`
