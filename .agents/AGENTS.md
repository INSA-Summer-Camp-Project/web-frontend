# Web Workspace Rules & Guidelines

## 1. Environment Variable Management

- **Do NOT** access `process.env` directly throughout the codebase.
- **Do NOT** use fallback defaults or inline fallbacks (e.g. `?? ""`) in components.
- All environment variable access must go through the central `env` object exported from `src/config/env.ts`.
- Public client-side environment variables **MUST** be prefixed with `NEXT_PUBLIC_`.

## 2. Component & Architecture Standards

- Use **React Server Components (RSC)** by default. Add `"use client"` only when interactivity, hooks, or DOM events are needed.
- Keep components modular: place generic UI primitives in `src/components/ui/` and domain features in `src/components/features/`.
- Enforce strict TypeScript types without using `any` or forced casting.

## 3. API Communication & Data Fetching

- Centralize all API client calls in `src/services/` or `src/lib/api.ts` using `env.NEXT_PUBLIC_API_URL`.
- Standardize error handling and UI state (loading/error/empty) for all async operations.
