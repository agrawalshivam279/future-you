# Technical Specification: Step 6.1a — Generation Pipeline Orchestrator

## 1. Overview
Step 6.1a implements the end-to-end sequential generation pipeline orchestrator (`src/lib/ai/generate-pipeline.ts`).
It chains the 5 modular AI generators built in Phase 5 into a single cohesive process:
1. `generateLifeModel`: generates baseline `LifeModel` with skeleton personas and habit levers.
2. `generatePersonas`: enriches dual personas (Current Path and Improved Path) with deep career, health, finances, relationships, and routines.
3. `generateTimelines`: projects chronological 1-, 3-, and 5-year milestones for both trajectories.
4. `generateLetters`: composes reflective letters addressed to the present self from both 5-year personas.
5. `generateDualRegretGratitude`: extracts deep regrets and gratitude reflections for both trajectories.

The orchestrator combines all artifacts into a unified `LifeModel`, tracks and accumulates token usage metrics, emits granular progress updates for UI consumption, and supports `AbortSignal` for instantaneous cancellation.

---

## 2. Architecture & Design

### Types and Interfaces
```typescript
export type PipelineStage =
  | 'life-model'
  | 'personas'
  | 'timelines'
  | 'letters'
  | 'reflections'
  | 'complete';

export interface PipelineProgress {
  stage: PipelineStage;
  label: string;
  description: string;
  progressPercent: number;
  stageIndex: number;
  totalStages: number;
}

export interface PipelineOptions {
  onProgress?: (progress: PipelineProgress) => void;
  signal?: AbortSignal;
}

export interface PipelineResult {
  model: LifeModel;
  tokenUsage: TokenUsage;
}
```

### Stage Metadata
- **Stage 1 (`life-model`)**: `20%` — "Synthesizing baseline life model..."
- **Stage 2 (`personas`)**: `40%` — "Deepening dual persona trajectories..."
- **Stage 3 (`timelines`)**: `60%` — "Projecting 1, 3, and 5-year milestones..."
- **Stage 4 (`letters`)**: `80%` — "Composing letters from your future selves..."
- **Stage 5 (`reflections`)**: `95%` — "Gathering reflections of regret and gratitude..."
- **Complete (`complete`)**: `100%` — "Life simulation complete"

### Assembly Contract
```typescript
const fullModel: LifeModel = {
  ...baseModel,
  currentPath: {
    ...personas.current,
    timeline: timelines.current,
    letter: letters.current,
    regrets: reflections.current.regrets,
    gratitude: reflections.current.gratitude,
  },
  improvedPath: {
    ...personas.improved,
    timeline: timelines.improved,
    letter: letters.improved,
    regrets: reflections.improved.regrets,
    gratitude: reflections.improved.gratitude,
  },
};
```

---

## 3. Invariants & Rules
1. **File Length**: Under 300 LOC.
2. **Function Declarations**: Use `export async function generatePipeline(...)` (no arrow functions for exported components/functions).
3. **Zero Cloud Storage**: Operates entirely in-memory with local configuration.
4. **Resilience**: Enforce validation before calling any LLM; check `signal.aborted` at every boundary.
5. **Accumulation**: Combine prompt, completion, and total tokens from all 5 sub-orchestrators.

---

## 4. Test Strategy
1. **End-to-End Orchestration**: Mocks each of the 5 AI sub-orchestrators, verifies proper order of invocation and parameters passed.
2. **Progress Sequence**: Verifies `onProgress` receives 6 sequential updates (stages 1 to 5 + complete) with increasing percentages.
3. **Model Assembly**: Verifies all subfields (`timeline`, `letter`, `regrets`, `gratitude`) are correctly embedded in both personas.
4. **AbortSignal Cancellation**: Verifies immediate halt when aborted prior to or mid-pipeline.
5. **Error Propagation**: Verifies that any failure in an intermediate step bubbles cleanly.
