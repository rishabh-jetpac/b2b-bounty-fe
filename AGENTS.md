# Codex React Project Guidelines

## Purpose
Use this repository as the baseline for building a **client-side React SPA**. Default to **Vite + React + TypeScript** and treat this file as the source of truth for project structure, library choices, and verification. Do not introduce SSR, backend services, or API server code unless the user explicitly asks.

## Default Stack
Codex should scaffold and extend projects with these defaults:
- `react`, `react-dom`
- `typescript`
- `vite`
- `react-router` for routing
- `@tanstack/react-query` for async/server state
- `zustand` for lightweight client state when shared state is actually needed
- `@mui/material` with Emotion for UI primitives and theming

Do not add extra state, form, CSS, or data libraries unless a task requires them.

## Expected App Shape
When creating a new client-side project or restructuring the current one, prefer this layout:

```text
src/
  app/          # bootstrap, providers, theme, router assembly
  routes/       # route-level pages
  features/     # feature-scoped UI and logic
  components/   # shared reusable UI
  hooks/        # reusable hooks
  store/        # Zustand stores
  lib/          # helpers, config, API utilities
  assets/       # local images and static imports
```

Start with a working shell:
- `src/main.tsx` mounts the app.
- `src/app` owns provider composition.
- A base route renders successfully before feature work begins.
- Shared theme tokens live in one place and are reused.

## Implementation Rules
- Use TypeScript and functional components only.
- Name components with `PascalCase`; hooks, helpers, and variables use `camelCase`.
- Keep route code thin and move reusable logic into `features`, `hooks`, or `lib`.
- Use React Query for network-backed state and caching.
- Use Zustand only for client-only shared state that does not belong in route params or React Query.
- Prefer MUI components before writing custom primitives.
- Keep styling centralized and token-driven; do not scatter hard-coded values when a theme token is appropriate.
- Do not add test frameworks or test files by default. This repo does not require automated tests now or later unless the user explicitly requests them.

## Required Commands
- `npm install` to install dependencies
- `npm run dev` to start local development
- `npm run lint` to validate code style
- `npm run build` to verify the TypeScript and production bundle
- `npm run preview` to smoke test the production build

## Completion Criteria
A scaffold or feature is not complete until:
- the app runs locally,
- routing and providers are wired correctly,
- `npm run lint` passes,
- `npm run build` passes,
- the changed UI has been manually checked for obvious desktop and mobile issues.
