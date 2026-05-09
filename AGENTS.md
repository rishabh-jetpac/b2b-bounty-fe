# Codex React Project Guidelines

## Purpose
Use this repository as the baseline for building a **client-side React SPA**. Default to **Vite + React + TypeScript** and treat this file as the source of truth for project structure, library choices, and verification. Do not introduce SSR, backend services, or API server code unless the user explicitly asks. Assume incoming UI references are **mobile designs first**, and implement the mobile layout before adapting it for larger screens.

## Design Resources
Use the local Stitch export directory at `dev_files/stitch_kiosk_data_rapid_portal/` as the primary design source for this repo. Each screen export lives in its own subdirectory and may include:
- `screen.png` for the visual reference
- `code.html` for exported layout/details
- `DESIGN.md` for broader design-system guidance when present

When a user references a Stitch screen for implementation, prefer the matching local export in `stitch_kiosk_data_rapid_portal/` over remote Stitch URLs unless the user explicitly says otherwise.

## Default Stack
Codex should scaffold and extend projects with these defaults:
- `react`, `react-dom`
- `typescript`
- `vite`
- `react-router` for routing
- `@tanstack/react-query` for async/server state
- `axios` for HTTP requests
- `zustand` for lightweight client state when shared state is actually needed
- `react-hook-form` + `yup` for form state and validation
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
  lib/          # helpers, config, shared API utilities
  assets/       # local images and static imports
  colors.ts     # shared app color tokens/constants
```

Start with a working shell:
- `src/main.tsx` mounts the app.
- `src/app` owns provider composition.
- A base route renders successfully before feature work begins.
- Shared theme tokens live in one place and are reused.
- All reused color values live in `src/colors.ts` and are imported from there.
- Put shared axios setup such as the base client, interceptors, and request config in `src/lib`.
- Put feature-specific API request functions in `src/features/<feature>/services/`.
- Put feature-specific React Query hooks in `src/features/<feature>/hooks/`.
- Follow the flow `src/lib` shared client -> feature service -> feature query/mutation hook -> UI.

## Mobile-First Design Rules
- Treat pasted or referenced designs as the mobile source of truth unless the user says otherwise.
- Build styles from the smallest viewport up, then add larger-screen adjustments with progressive breakpoints.
- Prioritize touch-friendly spacing, tap targets, safe-area handling, and vertically stacked flows by default.
- Keep page shells, navigation, and CTAs usable on narrow screens before adding tablet or desktop enhancements.
- When layout decisions are ambiguous, preserve the mobile composition rather than inventing desktop-only structure.

## Implementation Rules
- Use TypeScript and functional components only.
- Name components with `PascalCase`; hooks, helpers, and variables use `camelCase`.
- Keep route code thin and move reusable logic into `features`, `hooks`, or `lib`.
- Use React Query for network-backed state and caching.
- Use `axios` as the standard HTTP client for UI API integration.
- Do not call `axios` directly from routes, screens, or presentational components.
- Create services per feature under `src/features/<feature>/services/`, and keep request/response shaping there.
- Create React Query hooks per feature under `src/features/<feature>/hooks/`, and make them the interface consumed by UI code.
- Use `useQuery` hooks for read operations and `useMutation` hooks for create, update, and delete operations.
- Keep shared API concerns such as auth headers, base URLs, and interceptors in `src/lib` rather than duplicating them across features.
- Prefer feature-scoped API logic and hooks over global API files unless the behavior is truly shared across multiple features.
- Use Zustand only for client-only shared state that does not belong in route params or React Query.
- Use `react-hook-form` for forms and `yup` for validation schemas by default.
- Prefer MUI components before writing custom primitives.
- Keep styling centralized and token-driven; do not scatter hard-coded values when a theme token is appropriate.
- Centralize all app color constants in `src/colors.ts` and import them everywhere instead of repeating inline color values.
- Prefer responsive units and mobile-safe layout constraints over fixed desktop widths.
- Do not add test frameworks or test files by default. This repo does not require automated tests now or later unless the user explicitly requests them.
- Example API structure: `src/lib/api/client.ts` defines the shared axios client, `src/features/packs/services/packsService.ts` defines request functions, and `src/features/packs/hooks/usePacksQuery.ts` exposes the `useQuery` hook consumed by the screen.

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
- the changed UI has been manually checked on a mobile viewport first, then reviewed for obvious larger-screen issues.
