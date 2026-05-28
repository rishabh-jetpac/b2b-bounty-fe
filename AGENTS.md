# Codex React Project Guidelines

## Purpose
Use this repository as the baseline for building and refactoring a client-side React SPA for the Jetpac B2B portal. Default to Vite + React + TypeScript. Do not introduce SSR, backend services, or API server code unless the user explicitly asks. Treat referenced UI designs as mobile-first unless the user says otherwise.

## Design Resources
Use the local Stitch export directory at `dev_files/stitch_kiosk_data_rapid_portal/` as the primary design source. Each screen export may include:
- `screen.png` for the visual reference
- `code.html` for exported layout/details
- `DESIGN.md` for broader design-system guidance

When a user references a Stitch screen, prefer the matching local export over remote Stitch URLs unless the user explicitly says otherwise.

API reference material lives in `dev_files/data/`, including `endpoints.md` and the Postman collection.

## Default Stack
Use these defaults unless the task requires something else:
- `react`, `react-dom`
- `typescript`
- `vite`
- `react-router`
- `@tanstack/react-query`
- `axios`
- `zustand`
- `react-hook-form` + `yup`
- `@mui/material` with Emotion

Existing repo-specific libraries such as `react-toastify`, `fuse.js`, `react-simple-pull-to-refresh`, and `vite-plugin-pwa` are part of the current app and may be extended when relevant. Do not add extra state, form, CSS, or data libraries unless the task requires them.

## Project Structure
Prefer a feature-first layout. New UI and logic should be colocated inside the owning feature by default.

```text
src/
  app/          # app assembly: providers, router, theme, auth gates, layouts
  routes/       # thin route wrappers only
  features/
    <feature>/
      screens/      # route-level or feature-level screens
      components/   # feature-local UI pieces
      hooks/        # feature-local React Query hooks and other feature hooks
      services/     # feature API calls and request/response shaping
      state/        # feature-local client state when needed
      utils/        # feature-local formatters, selectors, schemas, helpers
      types.ts
      apiTypes.ts   # only when needed
  components/   # cross-feature reusable UI only
  hooks/        # cross-feature reusable hooks only
  store/        # cross-feature client state only
  lib/          # shared infra, config, and API utilities
  assets/       # local images and static imports
  colors.ts     # shared app color tokens/constants
```

Subfolders under a feature are optional when unused, but when a feature has screens/components/hooks/utils/state they should use the names above.

## Ownership Rules
- Keep `src/routes` thin. Route files should only import and render feature-owned screens.
- Put new screens in `src/features/<feature>/screens/`.
- Put feature-only components in `src/features/<feature>/components/`.
- Put feature-only helpers such as formatters, selectors, and validation schemas in `src/features/<feature>/utils/`.
- Put feature-only state in `src/features/<feature>/state/`.
- Keep `src/components`, `src/hooks`, `src/store`, and `src/lib` as shared escape hatches for code reused across multiple features.
- Keep `src/app` for global app assembly only: providers, router, query client, auth gates, theme, authenticated layout, and app-wide shell behavior.
- Reused color values belong in `src/colors.ts` and should be imported from there instead of repeated inline.

When touching existing code, prefer colocating feature-owned modules before creating or expanding top-level shared folders.

## API and State Rules
- Use TypeScript and functional components only.
- Keep route files thin and keep feature logic in `features`.
- Use React Query for network-backed state and caching.
- Use `axios` as the standard HTTP client.
- Do not call `axios` directly from routes, screens, or presentational components.
- Put shared axios setup such as the base client, interceptors, and request config in `src/lib`.
- Put feature-specific request functions in `src/features/<feature>/services/`.
- Put feature-specific React Query hooks in `src/features/<feature>/hooks/`.
- Follow the flow: shared client in `src/lib` -> feature service -> feature query or mutation hook -> UI.
- Use Zustand only for client-only shared state that does not belong in route params or React Query.
- Keep app-wide session/auth state in `src/store`; keep feature-only state inside the feature.

## UI and Design Rules
- Build mobile-first, then add larger-screen adjustments.
- Prioritize touch-friendly spacing, tap targets, safe-area handling, and vertically stacked flows.
- Preserve the mobile composition when layout intent is ambiguous.
- Prefer MUI components before writing custom primitives.
- Keep styling token-driven and avoid scattering hard-coded values when a theme token or shared color exists.
- Preserve existing app-level patterns such as the authenticated shell, drawer, bottom navigation, toasts, pull-to-refresh behavior, and PWA setup unless the user asks to change them.

## Forms and Validation
- Use `react-hook-form` for forms by default.
- Use `yup` for validation schemas by default.
- Colocate feature-specific schemas in `src/features/<feature>/utils/` unless they are genuinely cross-feature.

## Refactor Rules
- Refactors should move code toward the feature-first structure above.
- If a route owns real screen logic, move that logic into the feature’s `screens/` folder and leave a thin route wrapper behind.
- If a component, hook, utility, or state module is only used by one feature, move it into that feature instead of keeping it shared.
- Do not change behavior during structural refactors unless the user explicitly asks for behavior changes.

## Required Commands
- `npm install`
- `npm run dev`
- `npm run lint`
- `npm run build`
- `npm run preview`

## Completion Criteria
A scaffold, feature, or refactor is not complete until:
- the app runs locally
- routing and providers are wired correctly
- `npm run lint` passes
- `npm run build` passes
- changed UI has been manually checked on a mobile viewport first, then reviewed for obvious larger-screen issues
