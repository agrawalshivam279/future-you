---
name: flashback
version: '1.0'
description: >-
  Access, inspect, update, or summarize the Future You project's persistent memory ledger,
  architectural decisions (ADRs), milestones, progress history, and technical pivots.
  Includes self-healing section resilience, roadmap synchronization with root implementation_plan.md,
  and aggregate stats reporting mode. Use whenever the user asks to recall decisions, check project progress,
  log milestones, or triggers the /flashback command.
---

# 🕰️ Flashback — Project Memory & Decision Ledger

The `flashback` skill manages the persistent memory and decision history for the **Future You** project. It ensures that technical decisions, architecture choices, and implementation progress are accurately recorded, easily retrievable, and synchronized with the master roadmap.

## Memory Ledger & Roadmap Locations

- **Canonical Living Memory Ledger**: [`.agents/memory/flashback.md`](file:///d:/Future%20You/.agents/memory/flashback.md)
- **Root Pointer File**: [`flashback.md`](file:///d:/Future%20You/flashback.md)
- **Master Implementation Roadmap**: [`implementation_plan.md`](file:///d:/Future%20You/implementation_plan.md)

## When to Trigger Flashback

Trigger this skill automatically or manually under the following conditions:
1. **User asks for history**: User asks "what did we do last?", "what is the current status?", or uses the `/flashback` command.
2. **Milestone completed**: Upon finishing a phase or major feature step in the `implementation_plan.md`.
3. **Architecture Decision Record (ADR) taken**: When a significant technical or design decision is finalized.
4. **Session resumption**: When starting a new session to recall context.

## Operating Modes

### 1. View/Summarize Memory (`flashback status` / `flashback summary`)
- Read the canonical memory ledger.
- Summarize the current phase, recent activity, and latest ADRs.
- Present a concise snapshot to the user.

### 2. Aggregate Statistics (`flashback stats`)
- Generate a statistical view of project progress.
- Include completed phases vs total phases (0-14).
- Provide counts of completed modules and logged ADRs.

### 3. Log an Architectural Decision (`flashback record-adr`)
- Append a new ADR to the "Architecture Decision Records (ADRs)" section in the memory ledger.
- Use the following template:
  ```markdown
  ### ADR-XXX: [Title]
  - **Date**: YYYY-MM-DD
  - **Status**: [Accepted / Proposed / Rejected]
  - **Context**: [Why are we making this decision?]
  - **Decision**: [What is the decision?]
  - **Consequences**: [Impact of the decision]
  ```

### 4. Log a Progress Event & Sync Roadmap (`flashback log-progress`)
- Append an entry to the "Chronological Activity & Change Log" section.
- Use the following template:
  ```markdown
  ### [YYYY-MM-DD] — [Event/Phase Title]
  - **Details**: [Brief description of what was accomplished]
  - **Key Files Created/Modified**: [List of relevant files]
  ```
- **Crucial Step**: Ensure the corresponding task in [`implementation_plan.md`](file:///d:/Future%20You/implementation_plan.md) is marked with `[x]`.

### 5. Update Phase Status (`flashback update-phase`)
- Modify the "Implementation Phase Tracker" and "Executive Status Snapshot" tables in the memory ledger.
- Update phase statuses (e.g., from 🔴 Not Started to 🟡 In Progress or 🟢 Completed).
- Update the global status at the top of the file.

## Self-Healing Section Resilience

If any of the 4 canonical sections (Executive Status Snapshot, Architecture Decision Records (ADRs), Implementation Phase Tracker, Chronological Activity & Change Log) are missing from the memory ledger, recreate them with default/empty structures before modifying.

## Maintenance Guidelines

- Keep entries concise and factual.
- Preserve the historical integrity (do not rewrite history unless correcting typos).
- Always use accurate timestamps (YYYY-MM-DD).
