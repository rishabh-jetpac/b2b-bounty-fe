# Packs API Integration Plan

## Goal

Replace the mock-driven `/packs` catalog with the real authenticated packs API while preserving the current mobile-first packs UI and filter behavior.

This plan also defines the recommended next step for purchase integration, but treats catalog fetch as the first concrete implementation phase.

Primary references:

- `dev_files/data/endpoints.md`
- `dev_files/data/B2b Bounty.postman_collection.json`
- `src/features/packs/PacksScreen.tsx`
- `src/features/packs/mockPacks.ts`
- `src/features/assignment/services/mockOrderService.ts`

## Current State

- `/packs` renders from `mockPacks`.
- Filter options are derived client-side from the loaded dataset.
- `Buy now` still creates a mock order and navigates to `/inventory/:orderId`.
- Auth already uses the shared `apiClient`.
- There is no packs service or packs React Query hook yet.

## Final Scope

### Phase 1: Catalog integration

#### In scope

- Add a feature-scoped packs API service.
- Add a feature-scoped React Query hook for packs.
- Fetch `GET /api/v1/packs` through the shared `apiClient`.
- Normalize the API response into the existing `Pack` UI shape.
- Filter out inactive packs at the service boundary.
- Keep the current packs list layout, filter chips, purchase sheet, and client-side filtering UX.
- Add explicit loading, error, and empty states to the packs screen.
- Remove direct dependence on `mockPacks` from the screen.

#### Out of scope

- Server-driven filtering.
- Changing the current chip UX.
- Changing the current `PackCard` or `PurchaseSheet` information architecture.
- Silent fallback to mock data if the API fails.

### Phase 2: Purchase integration

#### Recommended next scope

- Replace mocked purchase creation with `POST /api/v1/inventory/purchase`.
- Stop using `createMockOrderFromPurchase` from the packs flow.
- Keep assignment behavior unchanged until the purchase response contract is confirmed.

#### Blocker

- The request contract for purchase is documented.
- The response contract for purchase has not been locked yet, so the exact post-purchase navigation shape is still unresolved.

## Locked Decisions

### Fetch strategy

- Fetch `/api/v1/packs` once with no query params.
- Keep all current filters client-side.
- Do not refetch when the user changes country, validity, or GB filters.

### Base URL strategy

- `VITE_API_BASE_URL` should remain the bare API origin, for example `http://localhost:8080`.
- Auth services continue to call `/auth/*`.
- Packs and future protected resources call `/api/v1/*` explicitly from feature services.

### Data boundary

- Keep the current UI-facing `Pack` type.
- Translate the API response inside the packs service.
- Do not leak raw API field names into components.

### Country display rule

- Use `region` as the primary user-facing location label.
- Normalize it to title case for standard values.
- Preserve common uppercase abbreviations when appropriate, such as `USA`.
- Set:
  - `countryInfo.code = country_code`
  - `countryInfo.display_name = normalized region label`

### Active catalog rule

- Exclude any pack where `is_active !== true`.
- Derive all filter options only from active packs that remain after normalization.

### Failure handling

- Add explicit loading, error, and empty states to the screen.
- Do not fall back to mock data when the API fails.
- Provide a retry path through React Query refetch.

## API Contract

### Endpoint

```http
GET /api/v1/packs
Authorization: Bearer <token>
```

### Optional query params

- `country_code`
- `region`

### Response

```json
{
  "data": [
    {
      "id": "2bbdbc4b-ab52-41cd-ace8-0485dc4fcbca",
      "name": "India 5GB",
      "country_code": "IN",
      "region": "india",
      "data_gb": 5,
      "validity_days": 7,
      "price_usd_cents": 299,
      "price_usd": 2.99,
      "is_active": true
    }
  ]
}
```

## UI Model Mapping

The current UI should continue using this shape:

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

### Mapping rules

- `id -> id`
- `name -> name`
- `data_gb -> dataInGB`
- `validity_days -> validityInDays`
- `price_usd -> price.value` as a fixed two-decimal string
- `price.currency = 'USD'`
- `price.symbol = '$'`
- `country_code -> countryInfo.code`
- `region -> countryInfo.display_name` after normalization

### Notes

- `price_usd_cents` can be ignored for the current UI because `price_usd` is already present and correctly typed for display conversion.
- If the backend later removes `price_usd`, the mapper can be updated without changing the UI components.

## Implementation Plan

### 1. Add packs API types

- Create API-scoped types under the packs feature for:
  - raw pack item
  - response envelope
- Keep them separate from the existing UI-facing `Pack` type.

### 2. Add packs service

- Create `src/features/packs/services/packsService.ts`.
- Implement `getPacks()`.
- Call `apiClient.get('/api/v1/packs')`.
- Filter inactive rows.
- Normalize the response into `Pack[]`.

### 3. Add packs query hook

- Create `src/features/packs/hooks/usePacksQuery.ts`.
- Expose a `useQuery` hook for the normalized packs list.
- Keep retry behavior conservative and explicit.

### 4. Replace mock usage in the screen

- Update `src/features/packs/PacksScreen.tsx`.
- Replace `mockPacks` reads with `usePacksQuery()`.
- Keep all current filter and selection state local to the screen.
- Continue deriving filter options from the loaded normalized dataset.

### 5. Add request-state UI

- Render a loading state while the query is pending.
- Render an error state with a retry action when the query fails.
- Render a catalog-empty state when the API returns no active packs.
- Keep the existing filtered-empty state for the case where active packs exist but filters remove all visible results.

### 6. Preserve current purchase flow temporarily only if needed during the transition

- If implementation is split into separate PRs, the screen may temporarily keep the existing purchase sheet and mocked purchase action after the real catalog is wired.
- This should be treated as a short-lived transitional state, not the target architecture.

### 7. Integrate real purchase next

- Create a feature-scoped purchase service under `src/features/packs/services/`.
- Replace the mock order creation call in `PacksScreen`.
- Send:

```json
{
  "pack_id": "<selected pack id>",
  "quantity": 1
}
```

- Lock navigation and success behavior only after the purchase response shape is confirmed.

## File Plan

- Add `src/features/packs/services/packsService.ts`
- Add `src/features/packs/hooks/usePacksQuery.ts`
- Update `src/features/packs/PacksScreen.tsx`
- Keep `src/features/packs/types.ts` as the UI contract unless a small API-types companion file is added
- Leave `src/features/packs/mockPacks.ts` in place only until the integration is fully verified, then remove it if unused

## Open Questions

### Purchase response contract

The request for `POST /api/v1/inventory/purchase` is known:

```json
{
  "pack_id": "<pack_uuid>",
  "quantity": 1
}
```

The missing piece is the response shape. The following must be confirmed before finalizing purchase integration:

- Does the response return `order_id`, `inventory_id`, or another identifier?
- Should success navigate to `/inventory/:id`, stay on `/packs`, or go somewhere else?
- Does the response already include pack summary data needed by the assignment screen?

## Verification

- Run `npm run lint`
- Run `npm run build`
- Manually review `/packs` on a mobile viewport first
- Confirm:
  - header still renders balance correctly
  - filters derive from API data
  - inactive packs do not appear
  - loading, error, and empty states behave correctly
  - selecting a pack still opens the current purchase sheet
