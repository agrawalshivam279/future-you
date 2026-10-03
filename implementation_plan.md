# Future You — Implementation Plan

This document serves as the step-by-step implementation guide for the Future You project (Phase 1 + 2 combined sprint). 

## HOW TO USE THIS GUIDE

1. This is a living document.
2. The `next_step` skill will read this file to find the first unchecked `[ ]` task and determine the next step.
3. As tasks are completed, change `[ ]` to `[x]`.
4. Do not skip phases; they are ordered by dependency.
5. Refer to `PRD`, `architecture.md`, and `design.md` for detailed specifications.

## OVERVIEW: THE BUILD ORDER

- **PHASE 0 — Project Scaffold & Tooling**
- **PHASE 1 — Design System & UI Primitives**
- **PHASE 2 — Type Definitions & State Management**
- **PHASE 3 — Settings & Configuration**
- **PHASE 4 — Onboarding Wizard**
- **PHASE 5 — AI Integration Core**
- **PHASE 6 — Generation Flow**
- **PHASE 7 — Dashboard & Split View**
- **PHASE 8 — Timeline**
- **PHASE 9 — Chat Interface**
- **PHASE 10 — Habit Levers**
- **PHASE 11 — Letter from Future Self + TTS**
- **PHASE 12 — Regret & Gratitude View**
- **PHASE 13 — Landing Page**
- **PHASE 14 — Polish & Integration Testing**

---

## PHASE 0 - Project Scaffold & Tooling

**Duration:** 1 Day
**Goal:** Initialize the Next.js 14 project with necessary tools, Tailwind CSS, Zustand, and OpenAI SDK.

### Why Now?
We must establish the foundation of the Next.js App Router, global styles, and essential dependencies before building any UI components or logic.

### 0.1 - Initialization
- [x] Create Next.js 14 project with App Router and strict TypeScript configuration
- [x] Set up Tailwind CSS with custom color tokens and install Framer Motion
- [x] Install Zustand with persist middleware and OpenAI SDK
- [x] Bundle Inter font locally
- [x] Create directory structure according to `architecture.md`
- [x] Create base layout (header, footer with disclaimer) and Globals.css with custom properties

### Phase 0 Exit Criteria
- Project runs locally without errors.
- Base layout is visible with custom fonts and Tailwind classes.
- All core dependencies are installed.

---

## PHASE 1 - Design System & UI Primitives

**Duration:** 2 Days
**Goal:** Build the foundational, reusable UI components based on the design system.

### Why Now?
Constructing primitive UI elements first ensures consistency and speeds up the development of complex views later (like Onboarding and Dashboard).

### 1.1 - Core Components
- [x] Implement Button component (all variants)
- [x] Implement Card component (with persona variant)
- [x] Implement Input and Textarea components
- [x] Implement Slider component
- [x] Implement Modal component
- [x] Implement Toast component + provider
- [x] Implement Skeleton loader and Spinner components
- [x] Implement Badge component

### 1.2 - Layout Components
- [x] Implement Header component
- [x] Implement Footer component (with disclaimer)
- [x] Implement Disclaimer modal (first-time visitor)

### Phase 1 Exit Criteria
- All primitive UI components are built and visually match `design.md`.
- Components are fully responsive and accessible.

---

## PHASE 2 - Type Definitions & State Management

**Duration:** 1-2 Days
**Goal:** Define TypeScript interfaces and setup Zustand stores for global state.

### Why Now?
Strong typing and centralized state are prerequisites for building robust forms, AI logic, and data flow.

### 2.1 - Type Definitions
- [x] Define `onboarding.types.ts` (all onboarding form data)
- [x] Define `life-model.types.ts` (generated life model structure)
- [x] Define `persona.types.ts` (persona definition, career, health, etc.)
- [x] Define `chat.types.ts` (chat messages)
- [x] Define `timeline.types.ts` (milestone structure)
- [x] Define `settings.types.ts` (API provider, keys)

### 2.2 - Zustand Stores
- [x] Create `settings-store.ts` (API key, provider, base URL, model name)
- [x] Create `onboarding-store.ts` (form data for all 6 steps, completion state)
- [x] Create `life-model-store.ts` (generated model, personas, loading state)
- [x] Create `chat-store.ts` (messages per persona, IndexedDB integration)
- [x] Create `ui-store.ts` (modal visibility, toast queue)

### Phase 2 Exit Criteria
- TypeScript compiles without errors.
- Zustand stores are testable and properly persist to localStorage/IndexedDB.

---

## PHASE 3 - Settings & Configuration

**Duration:** 1 Day
**Goal:** Create the settings page allowing users to configure their AI provider and manage data.

### Why Now?
The application cannot function without an AI provider configured. We need this ready before building features that make AI calls.

### 3.1 - Settings Page Implementation
- [x] Build Settings page with API configuration form
- [x] Implement Provider selector (OpenAI, Gemini, FreeLLMAPI, OpenRouter, Custom)
- [x] Implement API key input (password field with show/hide)
- [x] Implement Base URL input (auto-filled by provider selection, editable) and Model name input
- [x] Create "Test connection" button to validate API keys
- [x] Implement "Delete All Data" button with confirmation modal
- [x] Implement Data export (download all localStorage as JSON)

### Phase 3 Exit Criteria
- Users can input and save API credentials.
- Test connection successfully pings the selected API.
- Users can export all local data and permanently purge data with one click.

---

## PHASE 4 - Onboarding Wizard

**Duration:** 2-3 Days
**Goal:** Develop the 6-step onboarding wizard to collect user context.

### Why Now?
Onboarding data is the raw input required for generating the life model and personas.

### 4.1 - Wizard Structure
- [x] Build Onboarding page with step navigation and progress bar
- [x] Implement Step wrapper with animated transitions between steps
- [ ] Implement Step 1: Goals (short-term, long-term, dream life)
- [ ] Implement Step 2: Habits (sleep, exercise, diet, screen time, meditation)
- [ ] Implement Step 3: Time (work, study, social, creative, wasted hours)
- [ ] Implement Step 4: Money (income range, savings rate, debt, spending, goals)
- [ ] Implement Step 5: Skills (current, learning goals, career field, satisfaction, growth mindset)
- [ ] Implement Step 6: Fears & Values (fears, values, regrets, motivation, risk tolerance)

### 4.2 - Logic & Integration
- [ ] Add form validation per step
- [ ] Connect wizard to `onboarding-store.ts` to save progress
- [ ] Implement "Generate My Futures" button on the final step

### Phase 4 Exit Criteria
- Users can complete all 6 steps smoothly with data persisted on reload.
- Validation prevents proceeding with missing required data.

---

## PHASE 5 - AI Integration Core

**Duration:** 3-4 Days
**Goal:** Implement the AI client, prompts, and orchestration logic for generating the future models.

### Why Now?
With UI and user data ready, we need the core engine that generates the app's unique value: the personas and timelines.

### 5.1 - Client & Prompts
- [ ] Implement `lib/ai/client.ts` as a unified OpenAI-compatible client factory
- [ ] Create `lib/prompts/life-model-generator.ts`
- [ ] Create `lib/prompts/system-current-path.ts` and `lib/prompts/system-improved-path.ts`
- [ ] Create `lib/prompts/timeline-generator.ts`
- [ ] Create `lib/prompts/letter-generator.ts` and `lib/prompts/regret-gratitude-generator.ts`
- [ ] Audit prompt templates with `/eval_persona` (validate JSON schema conformance, tone differentiation, and honesty disclaimer)

### 5.2 - Generation Orchestration
- [ ] Implement `lib/ai/generate-life-model.ts` (calls LLM, parses response, validates, retries)
- [ ] Implement `lib/ai/generate-personas.ts`
- [ ] Implement `lib/ai/generate-timeline.ts`
- [ ] Implement `lib/ai/generate-letter.ts` and `lib/ai/generate-regret-gratitude.ts`
- [ ] Implement `lib/ai/chat-with-persona.ts` (streaming chat context)
- [ ] Implement `lib/ai/regenerate-futures.ts` (for habit levers)
- [ ] Add robust error handling (timeout, parse failure, API errors)

### Phase 5 Exit Criteria
- All AI generation functions can be executed successfully and return structured JSON/text.
- Timeouts and errors are caught gracefully.
- `/eval_persona` fidelity audit passes for both Current and Improved persona prompts.

---

## PHASE 6 - Generation Flow

**Duration:** 1 Day
**Goal:** Create the loading and sequence orchestration screen that users see while AI generates their futures.

### Why Now?
Generating the models takes time; we need a proper UX to keep the user informed and handle generation errors before showing the dashboard.

### 6.1 - Loading Screen Implementation
- [ ] Build Generation page / loading state shown after onboarding
- [ ] Implement sequential generation orchestration (life model → personas → timelines → letters → regret/gratitude)
- [ ] Add progress indicator showing current generation step
- [ ] Implement error recovery (retry button, go back to edit)
- [ ] Redirect to dashboard upon successful completion

### Phase 6 Exit Criteria
- User experiences a smooth, informative loading flow after onboarding.
- Errors during generation are handled with clear recovery options.

---

## PHASE 7 - Dashboard & Split View

**Duration:** 2 Days
**Goal:** Build the main dashboard to display the Current and Improved path personas.

### Why Now?
The dashboard is the central hub where users consume the generated content.

### 7.1 - Dashboard Implementation
- [ ] Build Dashboard page
- [ ] Implement Split view container (2-column desktop, stacked mobile)
- [ ] Create Persona card component (summary, mood, key stats)
- [ ] Add navigation links to chat, letter, regret/gratitude for each persona
- [ ] Implement Comparison stat rows (career, health, finances, skills) side by side
- [ ] Implement Regenerate button (re-runs generation with same inputs)

### Phase 7 Exit Criteria
- The dashboard visually compares both personas side-by-side (or stacked on mobile).
- All stats and navigation links render correctly.

---

## PHASE 8 - Timeline

**Duration:** 1-2 Days
**Goal:** Visualize the user's future milestones.

### Why Now?
The timeline is a core piece of the persona details, providing a concrete path for the user to review.

### 8.1 - Timeline Component Implementation
- [ ] Build Timeline component (horizontal desktop, vertical mobile)
- [ ] Implement Timeline node component with hover/click details
- [ ] Create Dual timeline layout (Current + Improved parallel tracks)
- [ ] Add Milestone detail tooltip/popover
- [ ] Add Draw animation on first render

### Phase 8 Exit Criteria
- Timeline renders milestones chronologically for both paths with interactive tooltips.

---

## PHASE 9 - Chat Interface

**Duration:** 2 Days
**Goal:** Implement the chat view allowing users to converse with their future selves.

### Why Now?
Chat is the primary interactive feature post-generation, requiring the complex streaming setup built in Phase 5.

### 9.1 - Chat UI Implementation
- [ ] Build Chat page (dynamic route: `/chat/current` or `/chat/improved`)
- [ ] Implement Chat interface component with Message bubble component
- [ ] Add Chat input with send button
- [ ] Display streaming response token-by-token
- [ ] Implement Chat history persistence via IndexedDB
- [ ] Create Persona header (name, summary, accent color)
- [ ] Add "Clear chat" button and auto-scroll to bottom on new message
- [ ] Show Loading indicator during response
- [ ] Run `/eval_persona` to test and calibrate chat character grounding and tone contrast between Current Path and Improved Path

### Phase 9 Exit Criteria
- Users can have a fluid, streaming conversation with either persona.
- Chat history persists across reloads.
- `/eval_persona` verification passes for both `/chat/current` and `/chat/improved` persona voices.

---

## PHASE 10 - Habit Levers

**Duration:** 1-2 Days
**Goal:** Allow users to tweak habits and see how their futures change.

### Why Now?
Habit levers demonstrate the dynamic nature of the tool, building on top of the dashboard and regeneration flows.

### 10.1 - Habit Levers Implementation
- [ ] Add Habit levers panel on the dashboard
- [ ] Implement dynamic sliders generated from the life model
- [ ] Add "Apply Changes" button to trigger regeneration flow
- [ ] Implement loading state during regeneration (skeleton over persona cards)
- [ ] Add Before/after diff indicators
- [ ] Debounce slider input (500ms)

### Phase 10 Exit Criteria
- Adjusting levers successfully regenerates the persona data and updates the UI to reflect changes.

---

## PHASE 11 - Letter from Future Self + TTS

**Duration:** 1-2 Days
**Goal:** Display the generated letter and read it aloud using Web Speech API.

### Why Now?
The letter provides an emotional anchor to the generated personas, and TTS enhances accessibility.

### 11.1 - Letter & TTS Implementation
- [ ] Build Letter page (dynamic route: `/letter/current` or `/letter/improved`)
- [ ] Create Letter view component (styled as a personal letter)
- [ ] Implement `lib/tts.ts` (Web Speech API wrapper with voice/rate/pitch control)
- [ ] Build TTS player component (play/pause/stop)
- [ ] Highlight current sentence during playback
- [ ] Add Download letter as text file option

### Phase 11 Exit Criteria
- The letter is readable and can be played aloud, paused, and stopped natively in the browser.

---

## PHASE 12 - Regret & Gratitude View

**Duration:** 1 Day
**Goal:** Display the regrets and gratitudes associated with each persona.

### Why Now?
Completes the persona detail views accessible from the dashboard.

### 12.1 - Regret & Gratitude Implementation
- [ ] Build Regret & Gratitude section on the dashboard
- [ ] Implement Two-column layout per persona (regrets left, gratitudes right)
- [ ] Add Animated list reveal (staggered fade-in)
- [ ] Implement Expandable items (click for full context)

### Phase 12 Exit Criteria
- Regrets and gratitudes are clearly displayed and animated smoothly.

---

## PHASE 13 - Landing Page

**Duration:** 1 Day
**Goal:** Create the initial landing page to welcome users.

### Why Now?
Finalizing the entry point ensures all flows (first-time, returning, missing API key) route correctly.

### 13.1 - Landing Page Implementation
- [ ] Build Landing page with headline, subtext, and CTA
- [ ] Add link to settings if no API key is configured
- [ ] Implement "Continue" button for in-progress onboarding
- [ ] Implement "View Dashboard" button if generation is already complete
- [ ] Add minimal ambient animation (reduced-motion safe)

### Phase 13 Exit Criteria
- Users are routed to the appropriate next step based on their saved state.

---

## PHASE 14 - Polish & Integration Testing

**Duration:** 2 Days
**Goal:** Ensure the application is robust, performant, and accessible.

### Why Now?
The final phase to catch edge cases and polish the UX before declaring V1 complete.

### 14.1 - Testing & Polish
- [ ] Perform End-to-end flow testing (onboarding → generation → dashboard → chat)
- [ ] Verify Mobile responsiveness
- [ ] Test Error states (no API key, network failure, malformed LLM response)
- [ ] Perform Performance check (bundle size, load time)
- [ ] Conduct Accessibility audit (keyboard nav, contrast, screen reader)
- [ ] Ensure Disclaimer appears everywhere required
- [ ] Verify Data deletion works completely
- [ ] Verify all localStorage keys use correct prefix

### Phase 14 Exit Criteria
- App passes all major workflows manually.
- No console errors in production flow.
- Accessibility minimums met.

---

## CRITICAL RULES

- **Framework**: Next.js 14 App Router, TypeScript strict, Tailwind CSS, Framer Motion.
- **State**: Zustand with localStorage.
- **Data Privacy**: ZERO data leaves the browser except to the LLM API.
- **AI Integration**: Always use structured JSON where possible. EVERY prompt must be in `lib/prompts/`.
- **UI/UX**: Dark mode by default. Transitions ≤ 300ms. All interactive elements must have aria labels.
- **No Backend**: No server-side storage, no user accounts, no databases.

---

## SUMMARY TIMELINE

- **Phase 0-4**: Foundation & Data Collection (~6-8 Days)
- **Phase 5-6**: AI Engine & Processing (~4-5 Days)
- **Phase 7-13**: Views & Interfaces (~9-12 Days)
- **Phase 14**: Polish (~2 Days)
- **Total Estimate**: ~3-4 Weeks for V1
