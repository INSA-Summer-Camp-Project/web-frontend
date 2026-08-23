# ENGINEERING REASONING RULES — NON-NEGOTIABLE

Your primary objective when remediating or building code is:
**One coherent system, one canonical representation for each concept, explicit business rules, predictable contracts, and no hidden compatibility behavior.**

> **A locally passing implementation is not acceptable if it creates inconsistency elsewhere.**

---

## The 10-Level Reasoning Hierarchy

When investigating bugs, inconsistencies, or architectural issues, you must think in this hierarchy:

1. **LEVEL 1 — Symptom**: "What is broken?"
2. **LEVEL 2 — Local cause**: "Why does this code produce the symptom?"
3. **LEVEL 3 — Contract**: "Which two things disagree?"
4. **LEVEL 4 — Invariant**: "What must always be true?"
5. **LEVEL 5 — Domain model**: "Why does the system represent this concept this way?"
6. **LEVEL 6 — System impact**: "Where else does this concept exist?"
7. **LEVEL 7 — Canonical solution**: "What should the entire system agree on?"
8. **LEVEL 8 — Migration**: "What needs to change and what obsolete code disappears?"
9. **LEVEL 9 — Verification**: "Can I prove the invariant?"
10. **LEVEL 10 — Regression**: "Did I introduce another inconsistency?"

---

## Repository-Wide Pattern Investigation ("Stop and Search")

**Repository search is part of reasoning, not just an afterthought.**

Before modifying a suspicious implementation, search the repository for related representations, names, patterns, and implementations.

If you find:

- Multiple names for the same concept
- Multiple implementations of the same operation
- Multiple API shapes or DTOs
- Multiple status-transition implementations
- Multiple hooks calling the same endpoint
- Multiple route paths representing the same resource
- Multiple sources of truth
- Repeated workarounds or casts

**Stop treating the issue as local.** Treat it as evidence of a systemic architectural problem. Search the entire repository for the pattern, determine the underlying cause, define the canonical solution, and remediate all occurrences consistently.

The required flow is:

```text
Find bug / discrepancy
  ↓
Search related concepts across entire repo
  ↓
Map all occurrences & affected boundaries
  ↓
Identify canonical model
  ↓
Determine blast radius
  ↓
Design proportional fix
  ↓
Implement canonical fix
  ↓
Delete obsolete implementations & workarounds
  ↓
Validate end-to-end
```

---

## Core Engineering Rules

### 1. NEVER solve a disagreement by hiding the disagreement

Do not use fallback chains, type casting (`as any`), structural coercion, or error swallowing just to make types or tests pass. If two parts of the system disagree, investigate why and eliminate the disagreement.

### 2. When you discover inconsistency, stop and investigate the root cause

Never patch a symptom blindly. Identify the competing representations, find where the canonical definition resides, and align all layers with that source of truth.

### 3. Never create a new compatibility layer to compensate for internal inconsistency

Distinguish **migration** from **compatibility**:

- Compatibility is allowed only when it is an explicit external API/product requirement.
- Internal inconsistency is never a compatibility requirement.
- Migrate all internal consumers to the canonical representation and delete the old format.

### 4. Proportionality & Anti-Over-Engineering ("Deep reasoning → Simple implementation")

The correct fix must be proportional to the actual problem. Do not introduce a new architecture, abstraction, pattern, dependency, or subsystem merely because a simpler canonical fix exists. Systemic reasoning does not mean systemic over-engineering.

### 5. Fallbacks: Legitimate Defaults vs. Bad Disguises

- **Allowed (Legitimate Fallback)**: `optional value → intentional domain default` (e.g., `user.name ?? "Anonymous"`, `config.timeout ?? DEFAULT_TIMEOUT`).
- **Forbidden (Bad Fallback)**: `representation A ?? representation B ?? representation C` to reconcile conflicting schemas or property names (e.g., `access_token ?? accessToken ?? token` or `role ?? lastActiveRole ?? user.role`).

### 6. Never use type assertions to hide architectural problems

Before writing `foo as SomeType`, ask: _Why doesn't foo already have SomeType?_ If the answer is mismatched DTOs, stale database models, or differing enums, fix the underlying mismatch. Type assertions are only valid when the value genuinely has the asserted type and TypeScript cannot infer it.

### 7. Do not swallow errors to make flows appear successful

Never introduce empty catch blocks (`.catch(() => {})` or `catch {}`) unless there is a deliberate, documented reason that the failure is truly ignorable. Ask: _If this operation fails, what state does the system believe it is in?_

### 8. Do not fix business-state problems with scattered conditionals

When multiple conditions govern state transitions (e.g., `OPEN → IN_PROGRESS → COMPLETED`), treat the domain as a state machine. Define valid states, valid transitions, allowed actors, preconditions, and side effects centrally and consistently.

### 9. Do not make tests pass by changing the tests first

When a test fails: understand the failure → determine intended behavior → fix the correct layer → re-run test. Never weaken assertions, delete tests, or mock away real behavior merely to match a flawed implementation.

### 10. Cross-layer contract completeness

Every cross-layer finding requires inspecting the full boundary stack:

```text
[Database] ↔ [Backend Service/DTO] ↔ [HTTP Contract] ↔ [Frontend API/Store] ↔ [UI Component]
```

A fix is not complete until all affected boundaries agree on the contract.

### 11. Remove obsolete code after fixing the canonical implementation

After fixing the canonical flow, proactively search for and delete:

- Unused duplicate functions and hooks
- Dead endpoints and route aliases
- Stale types, DTOs, and constants
- Workaround wrappers and dead UI components

### 12. Preserve semantics, not merely types

A value being technically valid does not mean it is semantically correct (e.g., `estimatedTime = "120"` satisfying `z.string()`, but meaning 120 minutes vs hours; or `budget !== earnings`, `userId !== profileId`). Always verify domain meaning.

### 13. Treat naming inconsistencies as architectural problems

Establish one coherent vocabulary across persistence, transport, state, and UI.

### 14. Every fix must survive a "hostile review"

Before declaring a finding resolved, verify: concurrent requests, race conditions, role switching, invalid transitions, stale cache, empty/zero values, boundary permissions, and pagination edge cases.

### 15. Apply these rules to newly created code

You must not fix a backend inconsistency by introducing a frontend workaround, or vice versa. Never create new technical debt while eliminating old technical debt.

---

## Vertical Slice Remediation Workflow

Fix findings one at a time using vertical slices. **Never batch unrelated fixes together before validating the previous fix.**

For each finding:

1. Understand the complete feature flow end-to-end.
2. Identify the root cause and all affected layers.
3. Define the canonical behavior and contract.
4. Implement the smallest architecturally correct cross-layer fix.
5. Update backend and frontend contracts together.
6. Remove obsolete code and workarounds created by the old implementation.
7. Run targeted unit tests.
8. Run relevant cross-layer/integration tests.
9. Manually inspect the complete affected code path.
10. Search repository-wide for remaining occurrences of the old pattern.
11. Run workspace quality checks (`format:check`, `lint`, `typecheck`, `test`).
12. Only then mark the finding resolved and move to the next item.

---

## Remediation Ledger Protocol

When executing multi-step remediation or addressing complex findings, maintain a structured ledger:

```text
FINDING #[N]: [Brief Description]
Status: IN PROGRESS

- Root Cause: [Why it is broken]
- Canonical Behavior: [Authoritative contract/rule]
- Affected Boundaries: [Database / Backend / Contract / Frontend / UI]
- Proportional Fix: [Cleanest minimal architectural fix]
- Obsolete Code Removed: [List of deleted files/functions/types]
- Backend Validation: [PASS / N/A]
- Frontend Validation: [PASS / N/A]
- Integration Tests: [PASS / N/A]
- Repository-Wide Pattern Search: [PASS - 0 remaining occurrences]
- Hostile Edge-Case Check: [Verified]

Status: RESOLVED
```

---

## Definition of Done

A finding or task is **NOT** resolved merely because:

- TypeScript compiles without errors.
- ESLint passes.
- A single unit test passes.
- An endpoint returns 200 OK.
- The UI renders without crashing.

A finding or task is resolved **ONLY** when:

1. **Root cause has been addressed** (not masked or bypassed).
2. **The canonical contract and domain behavior are established.**
3. **All affected layers (DB, Backend, HTTP, Frontend, UI) agree on that contract.**
4. **Obsolete implementations, duplicate hooks, and workarounds have been deleted.**
5. **Relevant automated unit and integration tests pass.**
6. **Relevant cross-layer and end-to-end behavior has been validated.**
7. **The complete affected code path has been inspected for correctness.**
8. **Repository-wide search confirms the old inconsistent pattern is eliminated.**
9. **No new workaround, duplication, hidden fallback, type lie, swallowed error, or architectural debt was introduced.**
10. **The change remains clean, simple, and immediately understandable to another senior engineer reading the code.**
