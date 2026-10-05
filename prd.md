# Future You — Product Requirements Document (PRD)

## 1. Product Overview

### 1.1 Vision
Future You is a web-based reflection tool that uses AI to generate two simulated versions of the user five years from now — one following their current trajectory, one following an improved path. Users can chat with each future self, read letters from them, adjust habit levers to see how changes affect outcomes, and reflect on regrets and gratitudes.

### 1.2 Problem Statement
People struggle to visualize the long-term consequences of their daily habits and decisions. Abstract advice like "save more" or "sleep better" lacks emotional impact. Future You makes the consequences tangible by embodying them in a character the user can talk to — themselves.

### 1.3 Target Users
- **Primary**: Adults (18-40) interested in self-improvement, productivity, or personal growth
- **Secondary**: Students making career/life decisions
- **Tertiary**: Anyone curious about "what if" scenarios for their life

### 1.4 Core Principles
1. **Privacy first** — All data stays on the user's device. Period.
2. **Honesty** — This is a reflection tool, not a fortune teller. Always disclaimed.
3. **Grounded outputs** — Every AI response is anchored in what the user told us. No generic platitudes.
4. **Minimal friction** — Onboarding should feel like a conversation, not a form.
5. **Emotional resonance** — The futures should feel personal enough to provoke genuine reflection.

---

## 2. Functional Requirements

### 2.1 Settings & Configuration

#### FR-2.1.1: API Provider Configuration
- User can select from preset providers: OpenAI, Google Gemini, FreeLLMAPI, OpenRouter, Custom
- Selecting a preset auto-fills the Base URL field
- User can manually edit the Base URL for any provider
- User enters their API key (displayed as password, with show/hide toggle)
- User can specify the model name (with per-provider suggestions)

#### FR-2.1.2: Connection Test
- "Test Connection" button sends a minimal request to verify the API key and endpoint
- Shows success (green) or failure (red + error message)

#### FR-2.1.3: Data Management
- "Delete All Data" button with confirmation modal
- Deletes all localStorage keys with `future-you:` prefix
- Clears IndexedDB chat history
- Redirects to landing page after deletion
- "Export Data" button downloads all stored data as a JSON file

---

### 2.2 Onboarding Wizard

#### FR-2.2.1: Multi-Step Form
- 6 steps, each on the same page with animated transitions
- Progress bar showing current step (filled dots)
- "Back" and "Continue" navigation
- "Skip" option on each step (uses sensible defaults)
- Form data persists across page reloads via Zustand + localStorage

#### FR-2.2.2: Step 1 — Goals
| Field | Type | Required | Details |
|-------|------|----------|---------|
| Short-term goals (1 year) | Tag/chip input | Yes (min 1) | User types and presses Enter to add |
| Long-term goals (5 years) | Tag/chip input | Yes (min 1) | Same as above |
| Dream life description | Textarea | No | "Describe your ideal life in a few sentences" |

#### FR-2.2.3: Step 2 — Daily Habits
| Field | Type | Required | Details |
|-------|------|----------|---------|
| Sleep hours per night | Slider (4-12, step 0.5) | Yes | Default: 7 |
| Exercise frequency | Radio (Never / Rarely / Weekly / Daily) | Yes | Default: Rarely |
| Diet quality | Radio (Poor / Average / Good / Excellent) | Yes | Default: Average |
| Screen time (non-work) | Slider (0-12h, step 0.5) | Yes | Default: 4 |
| Meditation/reflection practice | Toggle (Yes/No) | Yes | Default: No |

#### FR-2.2.4: Step 3 — Time Allocation
| Field | Type | Required | Details |
|-------|------|----------|---------|
| Work hours per week | Slider (0-80, step 1) | Yes | Default: 40 |
| Study/learning hours per week | Slider (0-40, step 1) | Yes | Default: 2 |
| Social time per week | Slider (0-40, step 1) | Yes | Default: 5 |
| Creative time per week | Slider (0-40, step 1) | Yes | Default: 1 |
| Self-assessed wasted time per week | Slider (0-40, step 1) | Yes | Default: 10 |

#### FR-2.2.5: Step 4 — Finances
| Field | Type | Required | Details |
|-------|------|----------|---------|
| Income range | Select (ranges) | Yes | Ranges in USD brackets |
| Savings rate | Slider (0-50%, step 1) | Yes | Default: 10% |
| Debt level | Radio (None / Low / Moderate / High) | Yes | Default: Low |
| Spending habits | Textarea | No | "What do you spend most on?" |
| Financial goal | Text input | No | "What's your top financial goal?" |

#### FR-2.2.6: Step 5 — Skills & Career
| Field | Type | Required | Details |
|-------|------|----------|---------|
| Current skills | Tag input | Yes (min 1) | Skills you already have |
| Skills you want to learn | Tag input | Yes (min 1) | Learning goals |
| Career field | Text input | Yes | Current or desired field |
| Career satisfaction | Slider (1-10) | Yes | Default: 5 |
| Growth mindset self-rating | Slider (1-10) | Yes | Default: 5 |

#### FR-2.2.7: Step 6 — Fears & Values
| Field | Type | Required | Details |
|-------|------|----------|---------|
| Biggest fears | Tag input | Yes (min 1) | Things that worry you about the future |
| Core values | Tag input | Yes (min 1) | What matters most to you |
| Current regrets | Textarea | No | "Anything you wish you'd done differently?" |
| Motivation style | Radio (External / Internal / Mixed) | Yes | Default: Mixed |
| Risk tolerance | Slider (1-10) | Yes | Default: 5 |

#### FR-2.2.8: Generation Trigger
- On completing Step 6, user clicks "Generate My Futures"
- System validates that all required fields are filled
- If API key is not configured, show modal directing to Settings
- Begin generation flow (FR-2.3)

---

### 2.3 Life Model Generation

#### FR-2.3.1: Generation Pipeline
The system generates content in this order:
1. **Life Model** — Structured JSON from user inputs (the foundation)
2. **Current Path Persona** — Detailed future self on the current trajectory
3. **Improved Path Persona** — Detailed future self on the better trajectory
4. **Timelines** — 1/3/5 year milestones for each persona
5. **Letters** — A personal letter from each persona
6. **Regret & Gratitude** — Lists from each persona
7. **Habit Levers** — Dynamic sliders derived from inputs

#### FR-2.3.2: Loading Experience
- Full-page loading screen during generation
- Shows current step: "Analyzing your habits...", "Building your current path...", etc.
- Progress bar or step indicator
- Estimated time: 30-90 seconds total
- Cancel button (returns to onboarding, data preserved)

#### FR-2.3.3: Error Handling
- If any step fails: show error message + retry button for that step
- If API key is invalid: direct to Settings
- If response is malformed: retry up to 2 times with adjusted prompt
- If all retries fail: show raw error + "Report Issue" guidance

#### FR-2.3.4: Output Storage
- All generated content stored in `life-model-store` via Zustand
- Persisted to localStorage under `future-you:life-model`
- Overwritten on regeneration (old data not kept)

---

### 2.4 Dashboard

#### FR-2.4.1: Split View
- Two persona cards displayed side by side (desktop) or stacked (mobile)
- Each card shows: persona name, summary (2-3 sentences), emotional state, key stats
- Each card has action buttons: Chat, Letter, Regrets & Gratitude
- Cards are color-coded: amber (Current Path), emerald (Improved Path)

#### FR-2.4.2: Quick Stats Comparison
- Below persona cards: a comparison grid
- Rows: Career, Health, Finances, Relationships, Skills
- Columns: Current Path | Improved Path
- Each cell: a short 1-line summary

#### FR-2.4.3: Navigation
- Header shows "Your Two Futures" title
- Settings button (gear icon) → navigates to settings
- Regenerate button → re-runs generation with current inputs
- Back to onboarding → allows editing inputs

---

### 2.5 Timeline

#### FR-2.5.1: Display
- Positioned below the persona cards on the dashboard
- Shows two parallel timelines (Current + Improved)
- Three milestones per timeline: Year 1, Year 3, Year 5
- Each milestone: title + short description

#### FR-2.5.2: Interaction
- Hover/tap on a milestone node reveals full description
- Milestones color-coded to their persona (amber / emerald)
- Mood indicator per milestone: positive (▲), neutral (─), negative (▼)

---

### 2.6 Chat

#### FR-2.6.1: Chat Interface
- Accessible from dashboard via "Chat" button on each persona card
- Route: `/chat/current` or `/chat/improved`
- Header shows persona name and accent color
- Full-screen chat interface with message history

#### FR-2.6.2: Message Display
- User messages: right-aligned, neutral background
- Persona messages: left-aligned, persona-colored background
- Timestamps on each message
- Streaming: tokens appear as they're received

#### FR-2.6.3: Persona Grounding
- System prompt includes the full persona object as context
- Persona answers as if it IS the user's future self
- Maintains consistency with generated summary, career, health, etc.
- Never breaks character (enforced via system prompt)
- Includes honesty disclaimer in system prompt

#### FR-2.6.4: Chat History
- Messages persisted in IndexedDB
- History available across page reloads
- "Clear Chat" button with confirmation
- Chat history is per-persona (two separate histories)

#### FR-2.6.5: Input
- Text input at bottom of screen
- Send button (arrow icon) or Enter key to send
- Shift+Enter for multiline
- Input disabled during response generation
- Max message length: 2000 characters

---

### 2.7 Habit Levers

#### FR-2.7.1: Slider Panel
- Section at the bottom of the dashboard
- 3-5 sliders generated dynamically from user inputs
- Default sliders: Sleep Hours, Study Hours/Week, Savings Rate
- Additional sliders based on onboarding data
- Each slider shows: label, current value, min/max

#### FR-2.7.2: Regeneration
- "Apply Changes" button triggers regeneration of both personas
- Modified input values are passed to the LLM with original inputs
- Both persona cards, timelines, letters, and regret/gratitude lists are regenerated
- Chat history is NOT cleared (but new responses reflect updated personas)
- Loading skeleton overlays persona cards during regeneration

#### FR-2.7.3: Feedback
- After regeneration, briefly highlight what changed (bold text or badge)
- Show which lever had the most impact (if detectable from output)

---

### 2.8 Letter from Future Self

#### FR-2.8.1: Letter Display
- Route: `/letter/current` or `/letter/improved`
- Styled as a handwritten-style letter (serif font, slight padding, warm tone)
- Opens with "Dear [current year] me," and closes with a sign-off
- Content is personal, specific, and grounded in the persona's life model

#### FR-2.8.2: Text-to-Speech
- Play button at the top of the letter
- Uses Web Speech API (`speechSynthesis`)
- Controls: Play / Pause / Stop
- Voice: default system voice (user can change in settings if we add it later)
- Current sentence highlighted during playback
- Graceful fallback if TTS is not supported (hide button, show tooltip)

#### FR-2.8.3: Download
- "Download as Text" button → saves letter as `.txt` file
- Filename: `letter-from-future-you-[persona].txt`

---

### 2.9 Regret & Gratitude

#### FR-2.9.1: Display
- Section on the dashboard, below timeline
- Two cards (one per persona)
- Each card has two columns: "Regrets" and "Gratitudes"
- Each list: 3-5 items
- Items are short (1-2 sentences each)

#### FR-2.9.2: Content Quality
- Regrets (Current Path): specific things the persona wishes the user had started doing
- Gratitudes (Improved Path): specific things the persona is thankful the user did
- Both grounded in the user's actual inputs (not generic)

---

### 2.10 Landing Page

#### FR-2.10.1: First Visit
- Headline: "Future You"
- Subtext: "Meet the person you're becoming — five years from now."
- CTA button: "Begin →" → navigates to onboarding
- Settings link in header

#### FR-2.10.2: Return Visit (Onboarding in Progress)
- CTA changes to "Continue →" → resumes onboarding

#### FR-2.10.3: Return Visit (Dashboard Ready)
- CTA changes to "View Your Futures →" → navigates to dashboard
- Secondary link: "Start Over" → clears data and restarts

---

### 2.11 Decision Simulator ("What If?" Fork Engine)

#### FR-2.11.1: Decision Scenario Definition
- User can define a major life decision or fork (e.g., career switch, relocation, starting a company, education).
- Input fields:
  - Decision Title (concise text, e.g., "Transition from Corporate to Solo Founder")
  - Detailed Description (context, risks, and motivation)
  - Time Horizon (Immediate, 6 months, 1 year)
  - Primary Domain (Career, Finance, Relationships, Health, Lifestyle)
- Option to select an existing preset scenario or author a custom fork.

#### FR-2.11.2: AI Impact Projection
- Evaluates the proposed decision against the user's saved Life Model and baseline inputs.
- Generates structured evaluation output:
  - Multi-horizon projections: Year 1 (shock/transition), Year 3 (adaptation), Year 5 (compounding).
  - Domain delta scores (-10 to +10) across: Career Growth, Financial Resilience, Energy & Vitality, Relationships, Deep Satisfaction.
  - Persona Reactions: First-person commentary from both the Current Path self and Improved Path self on the proposed decision.
  - Hidden Trade-offs & Unforeseen Blindspots (2-3 realistic frictions).
- Honesty disclaimer: explicitly frames scenario as an exploratory heuristic, not a predictive certainty.

#### FR-2.11.3: Scenario Management & Persistence
- Stored client-side in Zustand store (`future-you:decisions`).
- Supports saving multiple scenarios, comparing them side-by-side, or deleting scenarios.

---

### 2.12 Check-in Mode (Trajectory Alignment & Habit Drift)

#### FR-2.12.1: Periodic Behavior Check-in
- Interactive check-in interface (`/check-in`) enabling users to log their actual lived habits over the past week/month:
  - Sleep average (hours/night)
  - Exercise frequency (Never / Rarely / Weekly / Daily)
  - Deep work / learning hours logged
  - Screen time / wasted time estimates
  - Savings rate discipline
- Quick logging takes < 2 minutes.

#### FR-2.12.2: Algorithmic Drift & Alignment Calculation
- Pure client-side mathematical scoring engine comparing actual logs against:
  - Baseline Onboarding metrics (Current Path starting point)
  - Target Improved Path habits
- Produces an **Alignment Score** (0% to 100%) and per-habit **Drift Vectors** (e.g., "Trending toward Improved Path in Career (+15%), but drifting toward Current Path in Sleep (-20%)").

#### FR-2.12.3: Future Self Reflection Feedback
- Lightweight AI prompt generating a personal 2-3 sentence reflection from the Improved Path future self:
  - Acknowledges where the user stayed disciplined.
  - Gently and realistically highlights the compounding risk of observed drifts without guilt or toxic positivity.

#### FR-2.12.4: History & Streak Visualization
- Chronological check-in log and alignment sparkline.
- Persisted locally in Zustand store (`future-you:check-ins`).

---

### 2.13 Shareable Result Card (Privacy-Safe Visual Summary)

#### FR-2.13.1: Visual Card Component
- Aesthetically polished summary card rendered in dark theme with Future You branding:
  - Call-sign / User persona header
  - Dual Path contrast preview (5-Year Vision tags: Current vs. Improved)
  - Core Future Self Quote from the generated Letter
  - Trajectory metrics summary (Alignment / Habit focus)
  - Mandatory footer disclaimer: *"A reflection tool, not a prediction engine"*

#### FR-2.13.2: Privacy Redaction Mode
- Toggleable privacy controls before exporting:
  - Automatic masking/omission of sensitive financial brackets, debt, and private anxieties.
  - Preview updates in real-time.

#### FR-2.13.3: Pure Client-Side Rendering & Export
- 100% in-browser rendering via HTML5 Canvas / SVG (zero external screenshot APIs, zero data leakage).
- Export actions:
  - "Download PNG" (high-resolution image export)
  - "Download SVG" (vector format)
  - "Copy to Clipboard" (using navigator.clipboard with fallback notification)

---

## 3. Non-Functional Requirements

### 3.1 Privacy
- No data is transmitted except to the user's configured LLM API endpoint
- No analytics, tracking, or telemetry
- No cookies (except essential browser cookies)
- API keys stored in localStorage (user's responsibility)
- User can delete all data with one click

### 3.2 Performance
- First Contentful Paint: < 1.5 seconds
- Time to Interactive: < 3 seconds
- Initial bundle size: < 500KB JavaScript
- LLM generation: UI responsive during calls (non-blocking)
- Chat streaming: first token visible within 2 seconds of send

### 3.3 Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigable throughout
- Screen reader compatible (aria labels, live regions)
- Reduced motion support
- Minimum contrast ratio: 4.5:1

### 3.4 Browser Support
- Chrome 90+
- Firefox 90+
- Safari 15+
- Edge 90+
- Mobile: Chrome Android, Safari iOS

### 3.5 Honesty & Ethics
- Disclaimer visible on every page (footer)
- First-time modal explaining the tool's nature
- System prompts include "reflection tool, not prediction" framing
- No fear-mongering — Current Path should be realistic, not catastrophic
- No toxic positivity — Improved Path should be achievable, not utopian
- Both paths should feel like plausible versions of the user

---

## 4. User Stories

### Onboarding
- **US-1**: As a new user, I want to answer questions about my life so the AI can build a personalized future.
- **US-2**: As a user, I want to skip steps I don't want to answer and still get results.
- **US-3**: As a user, I want my progress saved so I can come back and finish later.

### Dashboard
- **US-4**: As a user, I want to see two versions of my future side by side so I can compare them.
- **US-5**: As a user, I want to see a timeline of milestones so I understand the journey, not just the destination.

### Chat
- **US-6**: As a user, I want to chat with my future self to ask specific questions about my life.
- **US-7**: As a user, I want each future self to stay in character and reference my actual inputs.
- **US-8**: As a user, I want my chat history saved so I can revisit conversations.

### Habit Levers
- **US-9**: As a user, I want to adjust habit sliders and see how my future changes, so I know which habits matter most.
- **US-10**: As a user, I want to compare before/after when I change a lever.

### Letter
- **US-11**: As a user, I want to read a personal letter from my future self that feels genuine and specific.
- **US-12**: As a user, I want to hear the letter read aloud for a more emotional experience.

### Privacy
- **US-13**: As a user, I want assurance that my data never leaves my device.
- **US-14**: As a user, I want to delete all my data with one click.

### Settings
- **US-15**: As a user, I want to configure my own AI provider so I'm not locked into one service.
- **US-16**: As a user, I want to test my API connection before starting onboarding.

---

## 5. Acceptance Criteria Summary

| Feature | Acceptance Criteria |
|---------|-------------------|
| Onboarding | All 6 steps completable, data persisted, validation works, skip works |
| Generation | Both personas generated, stored, and displayed within 90 seconds |
| Dashboard | Split view renders on desktop/mobile, all sections present |
| Chat | Messages stream in real-time, persona stays in character, history persists |
| Timeline | 6 milestones visible (3 per path), hover shows details |
| Habit Levers | Sliders functional, "Apply" regenerates both futures |
| Letter | Letter renders, TTS plays/pauses/stops, download works |
| Regret/Gratitude | Lists render per persona, content is specific to user |
| Decision Simulator | Scenario input, multi-horizon delta scores, persona reactions, local persistence |
| Check-in Mode | Habit logging, algorithmic alignment & drift scores, reflection snippet |
| Shareable Card | Clean visual card, privacy redaction, client-side PNG/SVG download & copy |
| Settings | API key saves, provider presets work, test connection works, data deletion works |
| Disclaimer | Visible on every page, first-time modal shows once |
| Privacy | No network calls except to configured LLM API |
| Responsiveness | Fully usable on 375px-width screens |

---

## 6. Out of Scope (Version 3)

- User accounts / authentication (strictly client-side local architecture preserved)
- Server-side storage or database
- Visual aging portrait with GAN / Diffusion image models (Phase 4 scope)
- Multi-language support / i18n
- Payment / subscription processing
- Native mobile app wrapper (React Native / Capacitor)
