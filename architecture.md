# Future You — System Architecture

## Overview

Future You is a client-side web application that uses LLM APIs to generate two simulated future versions of the user (5 years from now). All computation happens in the browser except for LLM API calls which go directly from the browser to the user's configured AI provider.

```
┌─────────────────────────────────────────────────────┐
│                    BROWSER                          │
│                                                     │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────┐ │
│  │  Next.js UI  │  │  Zustand     │  │ localStorage│ │
│  │  (React)     │←→│  Store       │←→│ / IndexedDB │ │
│  └──────┬───────┘  └──────────────┘  └────────────┘ │
│         │                                           │
│  ┌──────▼───────┐                                   │
│  │  AI Client   │                                   │
│  │  (lib/ai)    │                                   │
│  └──────┬───────┘                                   │
│         │ HTTPS (OpenAI-compatible)                 │
└─────────┼───────────────────────────────────────────┘
          │
          ▼
┌───────────────────┐
│  LLM Provider     │
│  (FreeLLMAPI /    │
│   OpenAI / Gemini │
│   / Anthropic /   │
│   OpenRouter)     │
└───────────────────┘
```

## Directory Structure

```
future-you/
├── public/
│   └── favicon.ico
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx                # Root layout (fonts, providers, disclaimer)
│   │   ├── page.tsx                  # Landing page
│   │   ├── onboarding/
│   │   │   └── page.tsx              # Onboarding wizard
│   │   ├── dashboard/
│   │   │   └── page.tsx              # Main dashboard (split view)
│   │   ├── chat/
│   │   │   └── [persona]/
│   │   │       └── page.tsx          # Chat with a specific persona
│   │   ├── letter/
│   │   │   └── [persona]/
│   │   │       └── page.tsx          # Letter view with TTS
│   │   ├── settings/
│   │   │   └── page.tsx              # API key, data management
│   │   └── globals.css               # Tailwind base + custom properties
│   │
│   ├── components/
│   │   ├── ui/                       # Reusable primitives
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── slider.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── modal.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── spinner.tsx
│   │   │   └── badge.tsx
│   │   ├── layout/
│   │   │   ├── header.tsx
│   │   │   ├── footer.tsx            # Contains honesty disclaimer
│   │   │   └── disclaimer-modal.tsx  # First-time visitor modal
│   │   ├── onboarding/
│   │   │   ├── step-goals.tsx
│   │   │   ├── step-habits.tsx
│   │   │   ├── step-time.tsx
│   │   │   ├── step-money.tsx
│   │   │   ├── step-skills.tsx
│   │   │   ├── step-fears-values.tsx
│   │   │   ├── progress-bar.tsx
│   │   │   └── step-wrapper.tsx
│   │   ├── dashboard/
│   │   │   ├── persona-card.tsx      # Summary card for one future self
│   │   │   ├── split-view.tsx        # Side-by-side container
│   │   │   ├── timeline.tsx          # 1/3/5 year milestone timeline
│   │   │   ├── timeline-node.tsx
│   │   │   ├── habit-levers.tsx      # Slider panel
│   │   │   ├── regret-gratitude.tsx  # Lists per persona
│   │   │   └── comparison-stat.tsx
│   │   ├── chat/
│   │   │   ├── chat-interface.tsx
│   │   │   ├── message-bubble.tsx
│   │   │   └── chat-input.tsx
│   │   └── letter/
│   │       ├── letter-view.tsx
│   │       └── tts-player.tsx
│   │
│   ├── lib/
│   │   ├── ai/
│   │   │   ├── client.ts             # Unified OpenAI-compatible client
│   │   │   ├── generate-life-model.ts
│   │   │   ├── generate-personas.ts
│   │   │   ├── generate-timeline.ts
│   │   │   ├── generate-letter.ts
│   │   │   ├── generate-regret-gratitude.ts
│   │   │   ├── chat-with-persona.ts
│   │   │   └── regenerate-futures.ts # Called when habit levers change
│   │   ├── prompts/
│   │   │   ├── system-current-path.ts
│   │   │   ├── system-improved-path.ts
│   │   │   ├── life-model-generator.ts
│   │   │   ├── timeline-generator.ts
│   │   │   ├── letter-generator.ts
│   │   │   └── regret-gratitude-generator.ts
│   │   ├── constants.ts
│   │   ├── utils.ts
│   │   └── tts.ts                    # Web Speech API wrapper
│   │
│   ├── stores/
│   │   ├── onboarding-store.ts       # Onboarding form data
│   │   ├── life-model-store.ts       # Generated life model + personas
│   │   ├── chat-store.ts             # Chat history per persona
│   │   ├── settings-store.ts         # API key, provider, preferences
│   │   └── ui-store.ts              # UI state (modals, toasts)
│   │
│   └── types/
│       ├── onboarding.types.ts
│       ├── life-model.types.ts
│       ├── persona.types.ts
│       ├── chat.types.ts
│       ├── timeline.types.ts
│       └── settings.types.ts
│
├── .rules                            # Project coding rules
├── architecture.md                   # This file
├── design.md                         # UI/UX design system
├── implementation_plan.md             # Step-by-step implementation guide
├── prd.md                            # Product requirements
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── .gitignore
```

## Data Architecture

### Storage Strategy

All data lives in the browser. No server-side persistence.

| Store | Backend | Key Prefix | Purpose |
|-------|---------|------------|---------|
| Settings | localStorage | `future-you:settings` | API key, provider config |
| Onboarding | localStorage | `future-you:onboarding` | Raw user inputs |
| Life Model | localStorage | `future-you:life-model` | Generated JSON model |
| Personas | localStorage | `future-you:personas` | Both future selves |
| Chat History | IndexedDB | `future-you-chat` | Message history (can grow large) |
| UI Prefs | localStorage | `future-you:ui` | Theme, dismissed modals |

### Core Data Models

#### User Inputs (Onboarding)

```typescript
interface OnboardingData {
  goals: {
    shortTerm: string[];       // 1-year goals
    longTerm: string[];        // 5-year goals
    dreamLife: string;         // Free text: "describe your ideal life"
  };
  habits: {
    sleepHours: number;        // 0-12
    exerciseFrequency: string; // "never" | "rarely" | "weekly" | "daily"
    dietQuality: string;       // "poor" | "average" | "good" | "excellent"
    screenTime: number;        // hours per day
    meditationOrReflection: boolean;
  };
  time: {
    workHoursPerWeek: number;
    studyHoursPerWeek: number;
    socialHoursPerWeek: number;
    creativeHoursPerWeek: number;
    wastedHoursPerWeek: number; // self-assessed
  };
  money: {
    incomeRange: string;
    savingsRate: number;       // percentage
    debtLevel: string;        // "none" | "low" | "moderate" | "high"
    spendingHabits: string;   // free text
    financialGoal: string;
  };
  skills: {
    currentSkills: string[];
    learningGoals: string[];
    careerField: string;
    careerSatisfaction: number; // 1-10
    growthMindset: number;      // 1-10 self-assessment
  };
  fearsAndValues: {
    biggestFears: string[];
    coreValues: string[];
    regrets: string;           // free text
    motivation: string;        // "external" | "internal" | "mixed"
    riskTolerance: number;     // 1-10
  };
}
```

#### Life Model (Generated by LLM)

```typescript
interface LifeModel {
  id: string;
  createdAt: string;
  inputs: OnboardingData;
  currentPath: Persona;
  improvedPath: Persona;
  habitLevers: HabitLever[];
}

interface Persona {
  id: "current" | "improved";
  name: string;               // e.g., "You in 2031 — Current Path"
  age: number;
  summary: string;            // 2-3 sentence overview
  personality: string;        // Tone description for chat system prompt
  emotionalState: string;     // Overall mood/outlook
  career: PersonaCareer;
  health: PersonaHealth;
  finances: PersonaFinances;
  relationships: PersonaRelationships;
  skills: string[];
  achievements: string[];
  struggles: string[];
  dailyRoutine: string;
  timeline: TimelineMilestone[];
  letter: string;
  regrets: string[];
  gratitudes: string[];
}

interface TimelineMilestone {
  year: 1 | 3 | 5;
  title: string;
  description: string;
  mood: "positive" | "neutral" | "negative";
}

interface HabitLever {
  id: string;
  label: string;              // e.g., "Sleep Hours"
  min: number;
  max: number;
  step: number;
  currentValue: number;       // From onboarding
  unit: string;               // e.g., "hours", "%", "hrs/week"
}
```

#### Chat

```typescript
interface ChatMessage {
  id: string;
  personaId: "current" | "improved";
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}
```

## AI Architecture

### Client Layer (`lib/ai/client.ts`)

A single configurable client that wraps the OpenAI SDK:

```typescript
// Conceptual — actual implementation in code
import OpenAI from "openai";

function createAIClient(settings: AISettings): OpenAI {
  return new OpenAI({
    apiKey: settings.apiKey,
    baseURL: settings.baseURL,      // FreeLLMAPI, OpenAI, etc.
    dangerouslyAllowBrowser: true,  // Client-side only app
  });
}
```

### Provider Presets

| Provider | Base URL | Notes |
|----------|----------|-------|
| OpenAI | `https://api.openai.com/v1` | Default |
| FreeLLMAPI | User-configured (localhost or hosted) | OpenAI-compatible |
| Gemini | `https://generativelanguage.googleapis.com/v1beta/openai` | Google's OpenAI-compat endpoint |
| OpenRouter | `https://openrouter.ai/api/v1` | Multi-model gateway |
| Custom | User-provided | Any OpenAI-compatible endpoint |

### AI Call Flow

```
User Action
    │
    ▼
Zustand Store (read user data / settings)
    │
    ▼
AI Module (e.g., generate-personas.ts)
    │
    ├── Reads prompt template from lib/prompts/
    ├── Injects user data into prompt
    ├── Calls client.chat.completions.create()
    │
    ▼
Parse Response
    │
    ├── Validate JSON structure
    ├── Fallback/retry on parse failure (up to 2 retries)
    │
    ▼
Update Zustand Store → Persist to localStorage
    │
    ▼
UI Reactively Updates
```

### Prompt Architecture

Each AI feature has a dedicated prompt file in `lib/prompts/`. Prompts follow this structure:

1. **System prompt**: Role definition + honesty disclaimer + output format instructions
2. **User content**: Structured user data injected as JSON
3. **Response format**: JSON schema or structured instructions

The system prompt for each persona chat includes the full persona object, ensuring grounded, consistent responses.

## Key Technical Decisions

### Why Client-Side Only?
- Privacy: zero data leaves the user's machine (except LLM calls)
- Simplicity: no server to maintain, no database, no auth
- Cost: zero hosting cost (static export possible)
- Trust: users can verify via browser dev tools that no data is being sent elsewhere

### Why OpenAI SDK for Everything?
- Most LLM providers now offer OpenAI-compatible endpoints
- One SDK, one interface, one error-handling path
- FreeLLMAPI is explicitly OpenAI-compatible
- Reduces code surface and maintenance burden

### Why Zustand over React Context?
- Built-in localStorage persistence via middleware
- No provider nesting / wrapper hell
- Works outside React components (useful for AI modules)
- Simpler API for the complexity level of this app

### Why IndexedDB for Chat History?
- Chat history can grow large (hundreds of messages)
- localStorage has a ~5MB limit
- IndexedDB supports structured queries and larger storage
- We use a simple wrapper — no need for a full ORM

## Security Considerations

- API keys are stored in localStorage in plaintext — this is the user's machine, and we warn them
- All LLM calls happen client-side — the Next.js server never sees API keys
- No CORS issues because calls go directly from browser to LLM provider
- Content Security Policy headers should restrict external connections to known LLM endpoints
- No user-generated content is rendered as HTML (XSS prevention)

## Performance Strategy

- **Code splitting**: Each page is a separate route, loaded on demand
- **Skeleton loaders**: Shown during AI generation (which can take 5-30 seconds)
- **Debounced habit levers**: Slider changes debounced to 500ms before triggering regeneration
- **Streaming**: Chat responses streamed token-by-token for perceived speed
- **Memoization**: Persona cards and timeline memoized to prevent re-renders during chat
- **Static export**: Landing page can be statically generated for instant load
