# Future You — Design System

## Design Philosophy

**Minimal. Serious. Reflective.**

This is a tool for self-examination, not entertainment. The design should feel like a quiet, well-lit room — not a carnival. Every element earns its place. White space is a feature. Animations are purposeful, never decorative.

The visual language communicates: *"This is your time to think clearly about your future."*

## Color System

### Core Palette (Dark Theme — Primary)

```
Background
  --bg-primary:     #0A0A0B     (near-black, the canvas)
  --bg-secondary:   #141416     (cards, elevated surfaces)
  --bg-tertiary:    #1C1C1F     (inputs, interactive areas)
  --bg-hover:       #232328     (hover states)

Text
  --text-primary:   #F5F5F7     (headings, primary content)
  --text-secondary: #A1A1AA     (body text, descriptions)
  --text-tertiary:  #71717A     (captions, metadata, timestamps)
  --text-muted:     #52525B     (disabled, placeholder)

Borders
  --border-primary: #27272A     (card borders, dividers)
  --border-focus:   #3F3F46     (focus rings)

Accents
  --accent-current:  #F59E0B    (amber — Current Path persona)
  --accent-improved: #10B981    (emerald — Improved Path persona)
  --accent-info:     #3B82F6    (blue — neutral info, links)
  --accent-danger:   #EF4444    (red — delete, errors)
  --accent-warning:  #F59E0B    (amber — warnings)

Current Path Tints (amber family)
  --current-bg:     #1C1710     (amber-tinted background)
  --current-border: #92400E30   (subtle amber border)
  --current-text:   #FCD34D     (amber highlight text)

Improved Path Tints (emerald family)
  --improved-bg:    #0F1C16     (emerald-tinted background)
  --improved-border:#065F4630   (subtle emerald border)
  --improved-text:  #6EE7B7     (emerald highlight text)
```

### Semantic Usage

| Element | Current Path | Improved Path |
|---------|-------------|---------------|
| Card border accent | Amber `#F59E0B` | Emerald `#10B981` |
| Persona name | Amber `#FCD34D` | Emerald `#6EE7B7` |
| Timeline nodes | Amber dot | Emerald dot |
| Chat bubble (assistant) | Amber-tinted bg | Emerald-tinted bg |
| Mood indicator | Amber variants | Emerald variants |

## Typography

### Font Stack

```css
--font-sans: "Inter", ui-sans-serif, system-ui, -apple-system, sans-serif;
--font-mono: "JetBrains Mono", ui-monospace, monospace;
```

We bundle Inter (variable weight) locally — no external font requests.

### Scale

| Token | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| `display` | 48px / 3rem | 700 | 1.1 | Landing page headline |
| `h1` | 36px / 2.25rem | 700 | 1.2 | Page titles |
| `h2` | 24px / 1.5rem | 600 | 1.3 | Section headers |
| `h3` | 20px / 1.25rem | 600 | 1.4 | Card titles |
| `body` | 16px / 1rem | 400 | 1.6 | Body text |
| `body-sm` | 14px / 0.875rem | 400 | 1.5 | Secondary text |
| `caption` | 12px / 0.75rem | 400 | 1.4 | Metadata, timestamps |
| `mono` | 14px / 0.875rem | 400 | 1.5 | Data values, JSON |

## Spacing & Layout

### Spacing Scale (Tailwind default)

| Token | Value | Common Use |
|-------|-------|------------|
| `xs` | 4px | Icon padding |
| `sm` | 8px | Tight gaps |
| `md` | 16px | Default padding |
| `lg` | 24px | Card padding |
| `xl` | 32px | Section gaps |
| `2xl` | 48px | Page sections |
| `3xl` | 64px | Hero spacing |

### Layout Breakpoints

| Name | Width | Behavior |
|------|-------|----------|
| `mobile` | < 768px | Single column, stacked cards |
| `tablet` | 768px – 1024px | Side-by-side with compact cards |
| `desktop` | > 1024px | Full side-by-side, comfortable spacing |

### Grid System

- **Dashboard split view**: 2-column grid on desktop, stacked on mobile
- **Onboarding**: Centered single column, max-width 640px
- **Chat**: Full-width on mobile, centered max-width 768px on desktop

## Component Specifications

### Button

```
States: default, hover, active, disabled, loading
Sizes: sm (h-8 px-3 text-sm), md (h-10 px-4 text-base), lg (h-12 px-6 text-lg)

Variants:
  primary   → bg-white text-black (stands out on dark bg)
  secondary → bg-bg-tertiary text-text-primary border-border-primary
  ghost     → bg-transparent hover:bg-bg-hover
  danger    → bg-red-500/10 text-red-400 hover:bg-red-500/20
  current   → bg-amber-500/10 text-amber-400 (for Current Path actions)
  improved  → bg-emerald-500/10 text-emerald-400 (for Improved Path actions)

Border radius: 8px (rounded-lg)
Transition: 150ms ease
Loading: spinner replaces text, button disabled
```

### Card

```
Background: var(--bg-secondary)
Border: 1px solid var(--border-primary)
Border radius: 12px (rounded-xl)
Padding: 24px
Shadow: none (flat design)
Hover: border-color transitions to --border-focus

Persona variant:
  Current Path  → left border 2px amber
  Improved Path → left border 2px emerald
```

### Input / Textarea

```
Background: var(--bg-tertiary)
Border: 1px solid var(--border-primary)
Border radius: 8px
Padding: 10px 14px
Focus: ring-2 ring-accent-info/50 border-accent-info
Placeholder: var(--text-muted)
Text: var(--text-primary)
```

### Slider (Habit Lever)

```
Track: bg-bg-tertiary, height 4px, rounded-full
Filled portion: gradient from amber to emerald (based on value)
Thumb: 20px circle, bg-white, shadow-sm
Label: above slider, text-sm text-text-secondary
Value display: right-aligned, font-mono, text-text-primary
```

### Modal

```
Overlay: bg-black/60, backdrop-blur-sm
Container: bg-bg-secondary, border-border-primary, rounded-2xl
Max width: 480px (disclaimer), 640px (content)
Padding: 32px
Close: X button top-right, ghost variant
Animation: fade in + scale from 95% (framer-motion)
```

### Toast

```
Position: bottom-right, fixed
Background: bg-bg-secondary, border-border-primary
Border radius: 12px
Padding: 12px 16px
Shadow: lg
Duration: 4 seconds, auto-dismiss
Types: success (emerald dot), error (red dot), info (blue dot)
Animation: slide up + fade in
```

### Chat Message Bubble

```
User message:
  Alignment: right
  Background: var(--bg-tertiary)
  Border radius: 16px 16px 4px 16px
  Max width: 80%

Assistant message (Current Path):
  Alignment: left
  Background: var(--current-bg)
  Border: 1px solid var(--current-border)
  Border radius: 16px 16px 16px 4px
  Accent dot: amber

Assistant message (Improved Path):
  Same as above but emerald tints
```

### Timeline

```
Layout: Horizontal on desktop, vertical on mobile
Line: 2px solid var(--border-primary), connecting nodes
Nodes:
  Year 1: small dot (12px)
  Year 3: medium dot (16px)
  Year 5: large dot (20px)

Current Path nodes: amber fill
Improved Path nodes: emerald fill
Hover: tooltip with milestone details
```

## Page Designs

### Landing Page

```
┌──────────────────────────────────────┐
│  [Logo]                  [Settings]  │
│                                      │
│                                      │
│        Future You                    │
│                                      │
│    Meet the person you're            │
│    becoming — five years             │
│    from now.                         │
│                                      │
│        [ Begin →]                    │
│                                      │
│                                      │
│  ────────────────────────────────    │
│  This is a reflection tool, not a   │
│  prediction. Results are             │
│  illustrative.                       │
└──────────────────────────────────────┘
```

### Onboarding

```
┌──────────────────────────────────────┐
│  [←]    Step 2 of 6    [Skip]        │
│  ═══════●●○○○○                       │
│                                      │
│  Your Daily Habits                   │
│                                      │
│  How many hours do you sleep?        │
│  ┌─────────────────────────────┐     │
│  │  ◄━━━━━━━━━━●━━━━━━━►  7h  │     │
│  └─────────────────────────────┘     │
│                                      │
│  How often do you exercise?          │
│  ┌─────────────────────────────┐     │
│  │  ○ Never  ○ Rarely          │     │
│  │  ● Weekly ○ Daily           │     │
│  └─────────────────────────────┘     │
│                                      │
│  ... more fields ...                 │
│                                      │
│            [ Continue →]             │
│                                      │
│  ────────────────────────────────    │
│  Reflection tool, not a prediction.  │
└──────────────────────────────────────┘
```

### Dashboard (Split View)

```
┌──────────────────────────────────────────────────────┐
│  [←]  Your Two Futures  [⚙ Settings] [↺ Regenerate] │
│                                                      │
│  ┌────────────────────┐  ┌────────────────────────┐  │
│  │ ▌CURRENT PATH      │  │ ▌IMPROVED PATH         │  │
│  │  You in 2031       │  │  You in 2031           │  │
│  │                    │  │                        │  │
│  │  "Still grinding   │  │  "Running my own       │  │
│  │   at the same      │  │   consulting firm,     │  │
│  │   desk..."         │  │   sleeping 8 hours..." │  │
│  │                    │  │                        │  │
│  │  💬 Chat  ✉ Letter │  │  💬 Chat  ✉ Letter     │  │
│  └────────────────────┘  └────────────────────────┘  │
│                                                      │
│  ── Timeline ──────────────────────────────────────  │
│  Year 1          Year 3          Year 5              │
│  ●───────────────●───────────────●  Current          │
│  ●───────────────●───────────────●  Improved         │
│                                                      │
│  ── Regrets & Gratitude ───────────────────────────  │
│  ┌────────────────────┐  ┌────────────────────────┐  │
│  │ Current Path       │  │ Improved Path          │  │
│  │ Regrets:           │  │ Gratitude:             │  │
│  │ • I wish you'd...  │  │ • Thank you for...     │  │
│  └────────────────────┘  └────────────────────────┘  │
│                                                      │
│  ── Habit Levers ──────────────────────────────────  │
│  Sleep       ◄━━━━━●━━━━━━━► 7h                     │
│  Study       ◄━●━━━━━━━━━━━► 2h/wk                  │
│  Savings     ◄━━━━━━●━━━━━━► 15%                     │
│  [Apply Changes]                                     │
│                                                      │
│  ────────────────────────────────────────────────    │
│  Reflection tool, not a prediction.                  │
└──────────────────────────────────────────────────────┘
```

## Animation Guide

| Element | Animation | Duration | Easing |
|---------|-----------|----------|--------|
| Page transitions | Fade + slide up 10px | 300ms | ease-out |
| Cards appearing | Fade + scale from 98% | 250ms | spring(0.5) |
| Modal open | Fade + scale from 95% | 200ms | ease-out |
| Modal close | Fade + scale to 95% | 150ms | ease-in |
| Toast enter | Slide up + fade | 200ms | ease-out |
| Toast exit | Slide right + fade | 150ms | ease-in |
| Chat message | Fade + slide up 5px | 150ms | ease-out |
| Skeleton pulse | Opacity 0.5 → 1 → 0.5 | 1500ms | ease-in-out, loop |
| Slider thumb | None (instant tracking) | — | — |
| Timeline draw | Line width 0 → 100% | 800ms | ease-out, staggered |
| Spinner | Rotate 360° | 800ms | linear, loop |

## Honesty Disclaimer Specifications

### Footer Disclaimer (Always Visible)
```
Text: "Future You is a reflection tool, not a prediction engine.
       Results are illustrative and based on your self-reported inputs."
Style: text-xs text-text-tertiary, centered, border-top border-border-primary
Padding: py-4
```

### First-Time Modal
```
Title: "Before you begin"
Body:  "Future You generates imagined scenarios based on what you tell it.
        These are not predictions — they're thought experiments designed
        to help you reflect on your habits and choices.

        • Your data stays on your device
        • Nothing is uploaded or stored on any server
        • You can delete everything at any time in Settings"
Button: "I understand — let's begin"
Show: Once (set localStorage flag on dismiss)
```

## Accessibility Checklist

- [x] All text meets WCAG AA contrast (4.5:1 minimum)
- [x] Focus indicators on all interactive elements (ring-2)
- [x] Keyboard navigation: Tab through all controls
- [x] aria-label on icon-only buttons
- [x] aria-live="polite" on chat message container
- [x] aria-live="assertive" on error toasts
- [x] role="status" on loading spinners
- [x] Reduced motion: `@media (prefers-reduced-motion: reduce)` disables all animations
- [x] Slider: aria-valuemin, aria-valuemax, aria-valuenow, aria-label
- [x] Modal: focus trap, Escape to close, aria-modal="true"
