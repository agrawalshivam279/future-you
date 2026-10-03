# Step 3.1a Technical Specification: API Configuration Form & Connection Tester

## 1. Overview
Step 3.1a implements the universal AI provider configuration interface and connection testing module:
- **`src/lib/ai/client.ts`**: Unified factory function `createAIClient` and ping validator `testAIConnection` wrapping the OpenAI SDK with timeout and error handling.
- **`src/components/settings/api-config-form.tsx`**: Configuration form with provider presets selector, masked API key input with show/hide toggle, customizable base URL & model name inputs, and "Test connection" button.
- **`src/app/settings/page.tsx`**: Settings page shell with navigation header and section organization.

---

## 2. Invariants & Rules Checklist
- [x] Zero hardcoded keys: API keys and URLs dynamically loaded from `useSettingsStore`.
- [x] All LLM calls centralized: Managed through `src/lib/ai/client.ts`.
- [x] Timeout safeguard: 60-second maximum timeout per AI call with abort controller.
- [x] Privacy notice: Explicit warning that keys reside locally in browser storage.
- [x] Toast feedback: Use `useToast` for connection success/error feedback (no `alert()`).
- [x] Accessibility: Full keyboard navigation, `aria-label`, visible focus indicators, and WCAG AA contrast.
- [x] Max 300 LOC per file: Modular form and client modules.

---

## 3. Architecture & Interfaces

### 3.1 AI Client Module (`src/lib/ai/client.ts`)
```typescript
export function createAIClient(settings: AISettings): OpenAI;
export async function testAIConnection(
  settings: AISettings
): Promise<{ success: boolean; message: string }>;
```

### 3.2 API Configuration Form (`src/components/settings/api-config-form.tsx`)
- Reads state from `useSettingsStore`.
- Provider selector: OpenAI, Google Gemini, FreeLLMAPI, OpenRouter, Custom.
- API Key: password input with eye icon toggle.
- Base URL & Model Name: auto-populated from presets with inline overrides.
- "Test Connection": executes `testAIConnection` with spinner indicator and status toast.

### 3.3 Settings Page (`src/app/settings/page.tsx`)
- Settings view layout with breadcrumb/back button and card containers.

---

## 4. Verification Plan
- **TypeScript & Lint**: `npx tsc --noEmit && npm run lint`
- **Unit Tests**:
  - `src/lib/ai/__tests__/client.test.ts`: test factory instantiation and test connection logic (mocking OpenAI client).
  - `src/components/settings/__tests__/api-config-form.test.tsx`: test provider switching, key visibility toggle, input changes, and test button trigger.
  - `src/app/settings/__tests__/page.test.tsx`: test settings page rendering.
