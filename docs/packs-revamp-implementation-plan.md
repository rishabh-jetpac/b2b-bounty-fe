# Packs Revamp Implementation Plan

## Goal

Replace the current single-screen `/packs` catalog with a two-step revamp flow:

- a destination directory at `/packs`
- a destination-specific packs screen at `/packs/:pageName`

The new flow should preserve the existing authenticated purchase behavior, but reorganize discovery around destinations first.

Primary references:

- `docs/requirement/packs-revamp.md`
- `src/features/packs/screens/PacksScreen.tsx`
- `src/features/packs/services/packsService.ts`
- `src/features/packs/services/purchaseService.ts`
- `src/app/AuthenticatedLayout.tsx`

## Final Scope

### In scope

- Replace the current `/packs` screen with a destination directory.
- Fetch the destination directory from the revamp destinations endpoint.
- Render the destination directory with virtualization using `@tanstack/react-virtual`.
- Add destination search on `/packs` using client-side `Fuse.js`.
- Navigate from the destination directory to `/packs/:pageName`.
- Fetch destination-specific packs from the revamp items endpoint using `pageName`.
- Preserve the existing purchase flow on the destination detail screen:
  - wallet balance in the header
  - pack selection
  - purchase bottom sheet
  - purchase mutation
  - success feedback
- Group destination packs into:
  - `Unlimited`
  - descending day-based sections
- Extend the authenticated header to support a leading back action.
- Keep the bottom navigation visible and keep `Packs` active for both `/packs` and `/packs/:pageName`.

### Out of scope

- Pack search on `/packs/:pageName`
- Filters on `/packs/:pageName`
- Pack count or other secondary metadata in the destination directory
- Flags, icons, marketing copy, or merchandising badges in the destination directory
- Server-driven search for destinations
- Silent fallback to the legacy `/api/v1/packs` catalog for the revamp flow
- Redesigning the purchase bottom sheet beyond the minimum changes needed for the new data source

## Locked Decisions

### Routing and app structure

- Use a true two-route flow:
  - `/packs`
  - `/packs/:pageName`
- `/packs/:pageName` should remain part of the packs area, not a modal or in-screen state transition.
- The destination detail page should support direct navigation even if the directory screen has not been visited first.

### Destination directory

- The destination directory is the source of truth for destination display names.
- Each row should render only the destination name.
- Destination search is client-side only.
- Use the existing `Fuse.js` dependency for destination search.
- Use `@tanstack/react-virtual` to virtualize the destination list.

### Destination detail screen

- Preserve the current purchase flow on the destination-specific packs screen.
- Remove the current filter-chip row entirely on `/packs/:pageName`.
- Do not add search on `/packs/:pageName`.
- Use the human-readable destination name from the directory response as the header title.
- If the detail page is opened directly and the display name is unavailable, fall back to a prettified `pageName` slug until destination metadata is available.

### Grouping and ordering

- Define the `Unlimited` section by unlimited data packs:
  - `dataInGB === -1`
- All unlimited-data packs render in a dedicated `Unlimited` section.
- Remaining packs render in day-based sections keyed by exact `validityInDays`.
- Day-based sections are sorted descending.
- Preserve API order inside each non-unlimited section unless a stronger backend merchandising rule emerges later.

### Shell behavior

- Extend the shared authenticated header with an optional leading back action.
- Use the back action on `/packs/:pageName`.
- Keep the bottom navigation visible on the destination detail page.
- The bottom navigation should keep `Packs` selected for any route under `/packs`.

### Empty and error behavior

- If `/packs/:pageName` succeeds but returns no packs, show an empty state on that page rather than redirecting back to `/packs`.
- The destination detail page should fetch independently from the directory query so deep links remain valid.

## Data Model

Keep raw revamp response shapes inside the service layer and expose normalized UI-facing models to the screens.

### Destination UI model

```ts
type Destination = {
  displayName: string
  pageName: string
}
```

### Destination pack UI model

The existing `Pack` type can remain the base purchase model if the revamp items API can be normalized into it.

```ts
type Pack = {
  id: string
  name: string
  price: {
    currency: string
    value: string
    symbol: string
  }
  dataInGB: number
  validityInDays: number
  countryInfo?: {
    code: string
    display_name: string
  }
}
```

### Derived section model

```ts
type DestinationPackSection =
  | {
      kind: 'unlimited'
      title: 'Unlimited'
      packs: Pack[]
    }
  | {
      kind: 'days'
      title: string
      validityInDays: number
      packs: Pack[]
    }
```

### Notes

- The destination directory service should normalize the temporary destination endpoint behind a stable frontend model so the endpoint can be swapped later without changing UI code.
- The destination detail service should normalize revamp item records into the existing `Pack` purchase model wherever possible.
- If the revamp items contract lacks fields currently required by purchase UI, resolve those gaps in the service layer rather than leaking raw API fields into components.

## Query and State Plan

### Query keys

- Destination directory:
  - `['packs', 'destinations']`
- Destination detail:
  - `['packs', 'destination', pageName]`
- Wallet and inventory queries should continue using their existing keys.

### Screen-local state

#### `/packs`

- search query

#### `/packs/:pageName`

- selected pack
- quantity
- snackbar message

### Shared state

- Do not introduce Zustand for the revamp flow unless a new cross-screen client-state need emerges.
- Continue using React Query for network-backed data and cache reuse.

## UX Plan

### `/packs` directory

- Header title remains `Packs`.
- Render a search field above the destination list.
- Use client-side fuzzy matching over the fetched destination dataset.
- Render a virtualized list optimized for roughly 200 destinations.
- Tapping a destination navigates to `/packs/:pageName`.

### `/packs/:pageName`

- Header shows:
  - leading back action
  - destination display name
  - wallet balance on the right
- Render packs as sectioned content:
  - `Unlimited`
  - descending day groups
- Reuse the current pack-card and purchase-sheet patterns where possible.
- Keep the purchase sheet behavior aligned with the current implementation:
  - quantity stepper
  - insufficient balance handling
  - mutation error handling
  - success snackbar

## Route Plan

### Keep

- `/packs` as the packs entry point

### Add

- `/packs/:pageName` as the destination detail route

### Update

- Bottom navigation selected-state logic so any pathname starting with `/packs` keeps the packs tab active

## Service Plan

### 1. Add destination directory service

- Create a feature-scoped service for the revamp destination directory.
- Normalize the raw response into `Destination[]`.
- Keep the temporary endpoint isolated to this service boundary.

### 2. Add destination directory query hook

- Create a dedicated React Query hook for destinations.
- Cache the destination dataset independently from destination-specific pack results.

### 3. Add destination items service

- Create a feature-scoped service for revamp destination items.
- Accept `pageName` as the input.
- Normalize the response into the existing purchase-ready `Pack[]` model.

### 4. Add destination items query hook

- Create a dedicated React Query hook keyed by `pageName`.
- Do not depend on the directory query for correctness.

## Component and Screen Plan

### Directory screen

- Split the current packs feature screen into a new destination-directory screen under `src/features/packs/screens/`.
- Add:
  - search input
  - directory loading state
  - directory error state
  - virtualized destination rows

### Destination detail screen

- Create a new destination-packs screen under `src/features/packs/screens/`.
- Reuse the current purchase behavior from `PacksScreen` rather than re-implementing purchase logic from scratch.
- Replace the current flat list and filter logic with section derivation:
  - unlimited packs
  - day-based packs

### Header support

- Extend `useAuthenticatedHeader` and the authenticated layout context so screens can supply:
  - optional leading action
  - optional leading icon semantics
- Use that support for the destination detail route.

## Implementation Plan

### 1. Refactor route ownership

- Keep `src/routes/PacksRoute.tsx` as the thin wrapper for the destination directory screen.
- Add a new thin route wrapper for `/packs/:pageName`.
- Update the router to include both packs routes inside the authenticated shell.

### 2. Extend the authenticated shell

- Update the shared header contract to support an optional leading back action.
- Update bottom-navigation active matching so nested packs routes still highlight `Packs`.

### 3. Add revamp API types and services

- Add API-scoped types for:
  - destination directory response
  - destination items response
- Add feature services to normalize those responses.

### 4. Add destination query hooks

- Add one hook for the destination directory.
- Add one hook for destination-specific packs by `pageName`.

### 5. Build the destination directory screen

- Add the `/packs` screen UI with:
  - search input
  - Fuse-backed client-side search
  - virtualized list rows using `@tanstack/react-virtual`
  - loading, error, and empty states

### 6. Build the destination detail screen

- Add the `/packs/:pageName` screen UI with:
  - header back action
  - wallet balance
  - grouped sections
  - existing purchase interaction
- Remove the old filter and search behavior from this screen.

### 7. Adapt purchase integration

- Point the destination detail screen at the existing purchase mutation and purchase sheet.
- Keep wallet refresh and inventory invalidation behavior intact.
- Preserve current success and failure handling patterns unless the revamp data contract requires a small UI adjustment.

### 8. Add fallback title behavior

- Resolve the header title from the directory cache when available.
- Fall back to a prettified `pageName` during direct-entry loading states.

### 9. Verify

- Run:
  - `npm install`
  - `npm run lint`
  - `npm run build`
- Manually review mobile viewport first.
- Verify:
  - `/packs` search behavior
  - virtualized scrolling
  - nested-route back behavior
  - `Packs` tab highlighting on `/packs/:pageName`
  - empty and error states on both screens
  - purchase flow on destination detail

## File Plan

- Update `src/app/AuthenticatedLayout.tsx`
- Update `src/app/useAuthenticatedHeader.ts`
- Update `src/app/router.tsx`
- Update `src/routes/PacksRoute.tsx`
- Add a new route wrapper for destination detail
- Update `src/features/packs/apiTypes.ts`
- Update `src/features/packs/types.ts`
- Add destination directory service and hook
- Add destination detail service and hook
- Add a new destination directory screen
- Add a new destination detail screen
- Extract or reuse packs feature helpers for:
  - search normalization
  - section derivation
  - slug prettification

## Remaining Risks

- The destination directory endpoint is described as temporary in the requirement, so its response shape may change. Keep its mapper isolated and minimal.
- The revamp items response contract is not yet documented in the repo, so normalization may require one implementation pass against live payloads.
- If the revamp items API does not include enough data for the current purchase UI, the service layer may need a small compatibility mapper or temporary fallback fields.
