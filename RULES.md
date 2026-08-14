# 📜 Developer Code of Conduct & Development Rules

> **Mandatory Guidelines & Workflow Rules for `INSA-Summer-Camp-Project` Web Frontend**

---

## 1. 🌿 Branch Naming Conventions

Every feature branch **MUST** follow one of these exact prefixes (enforced by git hooks):

| Prefix                | Usage                                     | Example                           |
| :-------------------- | :---------------------------------------- | :-------------------------------- |
| `feat/` or `feature/` | New feature implementation                | `feat/user-dashboard`             |
| `fix/` or `bugfix/`   | Bug fixes                                 | `fix/header-navigation-alignment` |
| `refactor/`           | Code refactoring without behavior change  | `refactor/api-client`             |
| `test/`               | Adding or updating unit/integration tests | `test/component-tests`            |
| `chore/`              | Dependency updates, tooling, config       | `chore/update-dependencies`       |
| `hotfix/`             | Emergency production fix                  | `hotfix/cors-origin-fix`          |

---

## 2. 🔄 The 5-Step Development Lifecycle

```text
1. Branch ──► 2. Build ──► 3. Test ──► 4. Verify ──► 5. Pull Request
```

### **Step 1: Create a Feature Branch**

Always start from `dev` and pull the latest changes before creating your branch:

```bash
git checkout dev
git pull origin dev
git checkout -b feat/your-feature-name
```

### **Step 2: Build the Feature**

- Write clean, modular code following the project guidelines in `.agents/AGENTS.md`.
- **Environment Variables**: Never access `process.env` directly. Always import `env` from `@/config/env`.
- **Component Architecture**: Use **React Server Components (RSC)** by default. Add `"use client"` only when interactivity, hooks, or DOM events are needed.
- **Component Structure**: Place generic UI primitives in `src/components/ui/` and domain features in `src/components/features/`.
- **API Requests**: Centralize API client calls in `src/services/` or `src/lib/api.ts` using `apiClient`.

### **Step 3: Write Tests for Every New Feature**

- Every new component, service method, or utility **MUST** come with corresponding test cases.
- Place unit tests in `tests/*.test.tsx`.

### **Step 4: Local Pre-Push Verification Checklist**

Before pushing your branch, run the full verification suite locally:

```bash
# 1. Type Check
pnpm exec tsc --noEmit

# 2. Lint Check
pnpm lint

# 3. Format Check (or run 'pnpm format' to auto-fix)
pnpm format:check

# 4. Run Tests
pnpm test
```

### **Step 5: Push & Create Pull Request**

- Push your branch to GitHub:
  ```bash
  git push origin feat/your-feature-name
  ```
- Open a Pull Request targeting the **`dev`** branch (never directly to `main`).
- Provide a clear PR title and summary detailing what was built/fixed and verification status.

---

## 3. 🚨 Golden Rules (Do's and Don'ts)

| ❌ **DONT'S**                                                      | ✅ **DO'S**                                                                  |
| :----------------------------------------------------------------- | :--------------------------------------------------------------------------- |
| **Don't** push directly to `main` or `dev`.                        | **Do** push to a feature branch and open a PR to `dev`.                      |
| **Don't** use `process.env.NEXT_PUBLIC_X ?? ""` inline fallbacks.  | **Do** declare environment variables in `src/config/env.ts` with Zod schema. |
| **Don't** use `any` or forced type casting (`as any`).             | **Do** write strict, explicit TypeScript interfaces in `src/types/`.         |
| **Don't** skip writing unit tests for new components or utilities. | **Do** add tests in `tests/` verifying UI & logic scenarios.                 |
| **Don't** bypass local hooks unless strictly necessary.            | **Do** fix linting/formatting errors locally before pushing.                 |
