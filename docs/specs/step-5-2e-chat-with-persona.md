# Technical Specification: Step 5.2e — Streaming Persona Chat Orchestrator

## 1. Context & Objectives
- **Module**: `src/lib/ai/chat-with-persona.ts`
- **Related Stores**: `src/stores/chat-store.ts`, `src/stores/settings-store.ts`
- **Related Prompts**: `src/lib/prompts/system-current-path.ts`, `src/lib/prompts/system-improved-path.ts`
- **Domain Types**: `ChatMessage`, `Persona`, `PersonaId`, `OnboardingData`, `AISettings`
- **Objective**: Author the streaming persona conversation orchestrator `chatWithPersona()` connecting persona conversational system prompts with historical conversation context, OpenAI-compatible streaming completion chunks, real-time token delivery callbacks, context window capping, and `AbortSignal` cancellation.

## 2. Requirements & Invariants
1. **Mandatory Honesty Disclaimer**:
   - Persona system prompt formulation uses `buildCurrentPathSystemPrompt` or `buildImprovedPathSystemPrompt`, each containing: `"You are a reflection tool, not a prediction engine."`
2. **Context Window Assembly & Capping**:
   - System prompt is injected as the initial message.
   - Preceding conversation messages are filtered and capped to `maxContextMessages` (default: 16) to prevent context token overflows.
   - Current user prompt is appended as the final message.
3. **Real-time Streaming Delivery**:
   - Initiates stream via `client.chat.completions.create({ stream: true, ... })`.
   - Iterates token chunks asynchronously and invokes optional `onToken` callback.
   - Returns the complete accumulated string upon stream completion.
4. **Cancellation Support**:
   - Honors `AbortSignal` via client options and iteration loop checks.
   - Immediately terminates on abort with `"Generation cancelled by user."`
5. **Local-First & Client-Side Configuration**:
   - Dynamic credential lookup via `resolveAISettings()`.
   - Clear diagnostic error if API key is unconfigured.
6. **Code Style & 300 LOC Invariant**:
   - Function declarations for exported functions.
   - Comprehensive JSDoc documentation.
   - Max 300 LOC per file.

## 3. Testing Plan
- Test `buildChatMessages` context assembly produces correct system prompt with honesty disclaimer, caps history, and appends user message.
- Test `chatWithPersona` streams tokens progressively via `onToken` callback and returns the full accumulated response.
- Test `chatWithPersona` differentiates system prompts between Current Path and Improved Path.
- Test error thrown when AI settings are unconfigured.
- Test error thrown when empty user message is provided.
- Test `AbortSignal` cancellation stops stream and rejects with cancellation error.
- Test error formatting for 401 Unauthorized and timeout errors.
