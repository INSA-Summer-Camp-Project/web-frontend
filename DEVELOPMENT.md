# 🚀 Web Frontend Development Guide

> **Getting Started, Project Architecture & Development Best Practices**

---

## 📥 1. Getting Started (Setup & Onboarding)

### **Prerequisites**

- **Node.js**: v22.x or higher
- **pnpm**: v11.21.0 or higher (`npm install -g pnpm`)

### **Initial Setup Steps**

```bash
# 1. Clone the web repository
git clone https://github.com/INSA-Summer-Camp-Project/web-frontend.git
cd web

# 2. Checkout the `dev` branch & pull latest changes
git checkout dev
git pull origin dev

# 3. Install project dependencies
pnpm install

# 4. Initialize environment configuration
cp .env.example .env

# 5. Create your feature branch (must follow branch naming conventions)
git checkout -b feat/your-feature-name
```

---

## 🏗️ 2. Project Architecture & Folder Structure

The frontend workspace follows Next.js App Router with **Modular Component Separation**:

```text
web/
├── .agents/               # Project-scoped AI rules & guidelines
├── .github/workflows/     # CI/CD automation pipelines
├── src/
│   ├── app/               # Next.js App Router pages & layouts
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/        # Component Architecture
│   │   ├── ui/            # Generic, reusable UI primitives (buttons, inputs, cards)
│   │   └── features/      # Domain-specific feature components (user profile, dashboard)
│   ├── config/            # Centralized Zod environment configuration
│   │   └── env.ts
│   ├── lib/               # Utility functions & Axios API client
│   │   └── api.ts
│   ├── services/          # API domain services
│   └── types/             # Centralized TypeScript interfaces & models
│       ├── api.ts
│       └── index.ts
├── tests/                 # Vitest component & unit tests
│   └── sample.test.tsx
├── RULES.md               # Developer Code of Conduct & Rules
└── DEVELOPMENT.md         # This development guide
```

---

## 🧩 3. Architectural Principles & Decoupling Rule

### 🔒 **The Decoupling Principle**

- **Loosely Coupled Components**: Feature components (`src/components/features/`) must be independent and self-contained. Generic UI components (`src/components/ui/`) must never import domain-specific features.
- **Server Components First**: Use **React Server Components (RSC)** by default for data fetching and rendering. Add `"use client"` only at the leaf component level when interactivity/state is needed.
- **Centralized API Layer**: Do NOT write raw `fetch` or `axios` calls directly inside components. Use `apiClient` from `src/lib/api.ts` or dedicated service modules in `src/services/`.
- **No Direct State Mutation**: Maintain clean component boundaries using props and local React state.

---

## 🛠️ 4. Useful Development Commands

```bash
# Start Next.js development server
pnpm dev

# Run TypeScript type check
pnpm exec tsc --noEmit

# Run Linter
pnpm lint

# Check Prettier formatting
pnpm format:check

# Format code with Prettier
pnpm format

# Run Unit Tests
pnpm test
```
