# Future You — Project Rules
# These rules MUST be followed by all agents and developers working on this project.

## Project Identity
- Project Name: Future You
- Type: Web Application (Next.js 14 App Router)
- Tone: Minimal, serious, reflective
- This is a REFLECTION tool, NOT a prediction tool. Never frame outputs as certainties.

## Tech Stack (Locked)
- Framework: Next.js 14 (App Router) — DO NOT use Pages Router
- Language: TypeScript (strict mode) — NO plain JavaScript files
- Styling: Tailwind CSS — NO CSS modules, NO styled-components, NO inline styles
- Animations: Framer Motion — DO NOT use CSS transitions for complex animations
- State Management: Zustand with localStorage persistence
- AI SDK: OpenAI-compatible SDK with configurable baseURL
- TTS: Browser Web Speech API only — NO external TTS APIs
- Storage: localStorage + IndexedDB only — NO backend database, NO server-side storage

## File & Folder Conventions
- Use kebab-case for all file and folder names (e.g., `life-model.ts`, `habit-levers/`)
- React components: PascalCase export, kebab-case filename (e.g., `onboarding-wizard.tsx` exports `OnboardingWizard`)
- Hooks: prefix with `use` (e.g., `use-life-model.ts`)
- Types: define in `types/` directory, suffix with `.types.ts`
- Constants: define in `lib/constants.ts`
- AI prompts: store in `lib/prompts/` as exported template literal functions

## Code Style
- Use `function` declarations for React components, NOT arrow functions
- Use arrow functions for callbacks and utility functions
- Always destructure props
- Always type props with an interface (not type alias)
- Prefer `interface` over `type` unless unions/intersections are needed
- Use `const` by default, `let` only when reassignment is necessary, NEVER `var`
- Maximum file length: 300 lines. Split if longer.
- Every exported function/component must have a JSDoc comment

## Component Rules
- One component per file
- Co-locate component-specific hooks and utils in the same directory
- Use composition over prop drilling — prefer Zustand or React Context
- All interactive elements must have aria labels
- All images must have alt text
- Loading states are required for all async operations
- Error boundaries must wrap every page-level component

## AI Integration Rules
- NEVER hardcode API keys — always read from Zustand store (which reads from localStorage)
- ALL LLM calls go through a single `lib/ai/client.ts` module
- ALWAYS use structured JSON output where possible (response_format or parsing)
- EVERY prompt must be stored in `lib/prompts/` — NO inline prompt strings in components
- ALWAYS include the honesty disclaimer in system prompts: "You are a reflection tool, not a prediction engine"
- Token usage must be estimated and shown to the user
- ALL AI calls must have error handling with user-friendly messages
- Timeout: 60 seconds max per AI call, with abort controller

## Data & Privacy Rules
- ZERO data leaves the browser (except to the user's chosen LLM API)
- All data stored in localStorage with the prefix `future-you:`
- User must be able to delete ALL their data from settings with one click
- No analytics, no tracking, no cookies (except essential)
- No external fonts — use system font stack or bundle locally
- API keys stored in localStorage are the user's responsibility — show a warning

## UI/UX Rules
- Mobile-first responsive design
- Dark mode is the default and primary theme
- All transitions must be ≤ 300ms
- No layout shift — use skeleton loaders
- Disable buttons during loading — show spinner
- Toast notifications for success/error — no alert() dialogs
- The honesty disclaimer must always be visible in the footer
- Side-by-side view must stack vertically on mobile (< 768px)

## Git & Development
- Commit messages: `type(scope): description` (e.g., `feat(onboarding): add goals step`)
- Types: feat, fix, refactor, style, docs, test, chore
- Branch naming: `feature/description`, `fix/description`
- No console.log in production code — use a logger utility or remove before commit

## Testing Philosophy
- Manual testing is acceptable for V1
- Critical paths to manually verify:
  1. Onboarding completes and stores data
  2. AI generates both personas without error
  3. Chat maintains persona consistency
  4. Habit levers trigger regeneration
  5. Data deletion works completely
  6. Works with no API key configured (shows helpful error)

## Accessibility Minimums
- All text: minimum 4.5:1 contrast ratio
- Keyboard navigable: all interactive elements reachable via Tab
- Focus indicators visible
- Screen reader: aria-labels on icons and non-text elements
- Reduce motion: respect `prefers-reduced-motion` media query

## Performance Targets
- First Contentful Paint: < 1.5s
- Lighthouse Performance: > 85
- Bundle size: < 500KB initial JS
- No unnecessary re-renders — memoize expensive components

## What NOT to Build (Out of Scope)
- User accounts / authentication (client-side only invariant)
- Server-side storage / database
- Payment processing
- Native mobile app
- Image generation with GAN / Diffusion models (Phase 4 — out of scope)
