# Step 2.2a Technical Specification: Settings & UI Zustand Stores

## 1. Overview
Step 2.2a implements the first tier of Zustand global state management:
- **`settings-store.ts`**: Universal OpenAI-compatible AI provider configuration (API key, endpoint base URL, model name, hyper-parameters) with local-first persistence under `future-you:settings`.
- **`ui-store.ts`**: Global interface state coordinator (active dashboard view, persona focus, modal visibility) persisted under `future-you:ui`.

---

## 2. Invariants & Rules Checklist
- [x] Zero cloud storage: Persists exclusively to client `localStorage` with prefix `future-you:`.
- [x] No hardcoded keys: API keys and URLs are user-configured and stored locally in the user's browser.
- [x] State management stack: Zustand with `persist` middleware.
- [x] Strict TypeScript: Typed interfaces for state and action payloads using `@/types`.
- [x] Max 300 LOC per file: Modular stores with explicit actions.
- [x] JSDoc documentation on all store hooks and exported helpers.

---

## 3. Store Specifications

### 3.1 Settings Store (`src/stores/settings-store.ts`)
- **Storage Key**: `future-you:settings`
- **State Interface**:
  - `provider`: `AIProvider` ('openai' | 'gemini' | 'freellmapi' | 'openrouter' | 'custom')
  - `apiKey`: `string`
  - `baseURL`: `string`
  - `modelName`: `string`
  - `temperature`: `number` (default: 0.7)
  - `maxTokens`: `number` (default: 4096)
- **Presets**:
  - Predefined defaults for OpenAI, Gemini, FreeLLMAPI, and OpenRouter.
- **Actions**:
  - `setProvider(provider)`: Updates provider and syncs default `baseURL` and `modelName`.
  - `setApiKey(apiKey)`
  - `setBaseURL(baseURL)`
  - `setModelName(modelName)`
  - `setTemperature(temp)`
  - `setMaxTokens(tokens)`
  - `resetSettings()`
  - `isConfigured()`: Evaluates readiness for LLM queries.

### 3.2 UI Store (`src/stores/ui-store.ts`)
- **Storage Key**: `future-you:ui`
- **State Interface**:
  - `isDisclaimerOpen`: `boolean`
  - `isSettingsOpen`: `boolean`
  - `activeDashboardTab`: `'split' | 'timeline' | 'regrets' | 'chat'`
  - `activePersona`: `'current' | 'improved'`
- **Actions**:
  - `setDisclaimerOpen(open)`
  - `setSettingsOpen(open)`
  - `setActiveDashboardTab(tab)`
  - `setActivePersona(persona)`
  - `resetUI()`

---

## 4. Verification Plan
- **TypeScript strict check**: `npx tsc --noEmit`
- **Lint**: `npm run lint`
- **Unit Tests**:
  - `src/stores/__tests__/settings-store.test.ts`
  - `src/stores/__tests__/ui-store.test.ts`
- **Coverage**: 100% action and persistence coverage.
