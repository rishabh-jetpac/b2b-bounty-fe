# Inventory Screen Implementation Plan

## Goal

Implement a real mobile-first inventory experience for the authenticated SPA, replacing the current `/inventory` placeholder with a backend-backed screen that supports:

- grouped unassigned inventory
- assigned inventory history
- failed inventory history
- assignment from inventory
- reassignment from assigned items

Primary references:

- `dev_files/stitch_kiosk_data_rapid_portal/history_screen_no_balance_header`
- `dev_files/stitch_kiosk_data_rapid_portal/assignment_screen_icons_fixed`
- `dev_files/stitch_kiosk_data_rapid_portal/reassignment_modal_no_header`
- `dev_files/data/endpoints.md`

## Final Scope

### In scope

- Replace the current `/inventory` placeholder with a real inventory screen.
- Fetch inventory from `GET /api/v1/inventory` without a status param.
- Partition the fetched items client-side into:
  - `unassigned`
  - `assigned`
  - `failed`
- Default the screen to the `Unassigned` tab.
- Show three tabs:
  - `Unassigned`
  - `Assigned`
  - `Failed`
- Render count bubbles inside the tab labels.
- Group `Unassigned` inventory client-side by:
  - `packId`
  - `packName`
- Add search to all tabs.
- Use a shared query string across tabs.
- Use tab-specific search behavior:
  - `Unassigned`: search by pack
  - `Assigned`: search by email or pack
  - `Failed`: search by email or pack
- Move the search field below the tabs.
- Navigate from unassigned pack groups into a real assignment route:
  - `/inventory/assign/:packId`
- Reuse the existing full-screen assignment flow, but switch it from mock order data to real inventory-by-pack data.
- Submit assignments through the real backend endpoint:
  - `POST /api/v1/inventory/packs/{packId}/assign`
- Support reassignment from the `Assigned` tab via an in-place modal.
- Submit reassignment through:
  - `PUT /api/v1/inventory/{id}/assign`
- Keep `Failed` items read-only in v1.
- After successful assignment or reassignment:
  - return to `/inventory`
  - refetch inventory

### Out of scope

- Adding a new backend status beyond:
  - `unassigned`
  - `assigned`
  - `failed`
- Any `pending` tab or derived pending state.
- Retry or repair actions for failed items.
- Inline assignment UI inside the inventory list.
- A separate history screen or terminology rename from `Inventory` to `History`.
- Persisting client-only inventory edits without a refetch.
- Local mock data for inventory in the final implementation.

## API Contract Alignment

The inventory implementation should assume the backend list endpoint returns item-level records.

Minimum frontend shape needed for the agreed UI:

```ts
type InventoryItem = {
  id: string
  orgId: string
  packId: string
  packName: string
  status: 'unassigned' | 'assigned' | 'failed'
  purchasedAt: string
  recipientEmail?: string
  eventAt?: string
}
```

### Notes

- `GET /api/v1/inventory` is the source of truth for the inventory screen.
- `Unassigned` cards are grouped client-side from item-level records.
- `Assigned` and `Failed` rows remain item-level.
- `recipientEmail` is required for:
  - `Assigned` tab rendering
  - `Failed` tab rendering
  - email search on those tabs
  - reassignment context
- `eventAt` represents the best backend event timestamp for recency sorting, such as:
  - `assigned_at`
  - `updated_at`
  - `failed_at`
- If the backend only returns `purchasedAt`, the screen can still render, but recency labels and sort quality will be degraded.

## UX Decisions Locked

### Naming and app structure

- Keep product terminology as `Inventory` everywhere in the app.
- Treat the Stitch `History` label as a visual reference only.
- Keep the bottom navigation destination as `/inventory`.

### Tabs

- Tab order is:
  - `Unassigned`
  - `Assigned`
  - `Failed`
- Default active tab is `Unassigned`.
- Tab labels include count bubbles.
- Do not repeat the counts in section headings.

### Search

- The search query is shared across tabs.
- The search input sits below the tab row.
- The placeholder changes by active tab:
  - `Unassigned`: `Search by pack`
  - `Assigned`: `Search by email or pack`
  - `Failed`: `Search by email or pack`
- If the current shared query is not meaningful for the active tab, that tab should show no results rather than silently rewriting the query.

### Unassigned tab

- Render grouped pack cards rather than item rows.
- Group by `packId` plus `packName`.
- Show a single `Assign` CTA per group.
- Search only against pack fields.

### Assigned tab

- Render individual inventory rows.
- Each row should surface:
  - recipient email
  - pack name
  - event recency
- Search against:
  - recipient email
  - pack name
- Tapping a row opens a reassignment modal.

### Failed tab

- Render individual inventory rows.
- Search against:
  - recipient email
  - pack name
- Rows are read-only in v1.
- No retry or repair action is defined yet.

### Sorting

- `Assigned` sorts newest first using the inventory event timestamp, not purchase time.
- `Failed` sorts newest first using the inventory event timestamp, not purchase time.
- `Unassigned` grouping order can follow dataset order unless the backend exposes a stronger business ordering rule.

### Assignment flow

- Replace the old mock `orderId` semantics with real pack-based semantics.
- Change the assignment route to:
  - `/inventory/assign/:packId`
- Reuse the current full-screen assignment UI.
- The page should load live unassigned inventory for the selected `packId`.
- The page should submit real assignment mutations through the backend.
- On success:
  - show success feedback
  - navigate to `/inventory`
  - invalidate inventory queries

### Reassignment flow

- Reassignment is available only from the `Assigned` tab.
- Use an in-place modal on top of the inventory screen, not a full-screen route.
- The modal should contain:
  - current item context
  - a single email input
  - confirm action
  - cancel action
- Successful reassignment should:
  - close the modal
  - refetch inventory

## Data and State Plan

### Inventory data

- Add a feature-scoped inventory service under `src/features/inventory/services/`.
- Add a React Query hook for the inventory list under `src/features/inventory/hooks/`.
- Fetch all inventory once from `/api/v1/inventory`.
- Partition and derive view models in the feature layer rather than in route code.

### Assignment data

- Move the assignment page off the mock order service.
- Add a feature service or query helper that derives assignment-page data from live inventory records for a given `packId`.
- Keep backend request shaping in feature services, not in UI components.

### Mutation behavior

- Assignment mutation should call the real pack-assign endpoint.
- Reassignment mutation should call the real item-assign endpoint.
- Both mutations should invalidate the shared inventory query on success.
- Do not introduce Zustand for this flow unless a clear shared-client-state need emerges.

## Route Plan

### Inventory route

- Keep `/inventory` as the main inventory destination.
- Replace the placeholder route component with the real inventory screen.

### Assignment route

- Replace `/inventory/:orderId` with `/inventory/assign/:packId`.
- Update navigation sources to use `packId`.
- Remove the dependency on the mock order service for inventory assignment.

## Implementation Plan

### 1. Create the inventory feature structure

- Add a new `inventory` feature area with:
  - types
  - API response types
  - service layer
  - React Query hooks
  - formatting helpers
  - main screen component
  - reassignment modal component

### 2. Implement inventory list fetching

- Add `getInventory()` in the feature service layer.
- Normalize the backend response into frontend inventory item types.
- Add a React Query hook for the shared inventory dataset.

### 3. Build derived inventory selectors

- Partition the fetched inventory into:
  - unassigned items
  - assigned items
  - failed items
- Build grouped unassigned card data from the unassigned slice.
- Add search filtering helpers for each tab.
- Add sorting helpers for assigned and failed rows.

### 4. Replace the `/inventory` placeholder UI

- Replace the current placeholder route with the real inventory screen.
- Build the tab row with count bubbles.
- Add the tab-aware search input below the tabs.
- Render:
  - grouped unassigned cards
  - assigned rows
  - failed rows
- Add loading, error, and empty states per the current app patterns.

### 5. Update assignment routing semantics

- Change the assignment route from `/inventory/:orderId` to `/inventory/assign/:packId`.
- Update the route component and param handling.
- Update the inventory `Assign` CTA to navigate to the new path.

### 6. Convert the assignment screen to real data

- Remove reliance on the mock order service for this flow.
- Load assignment-page summary from live unassigned inventory for the selected `packId`.
- Preserve the current assignment page structure where it still fits:
  - hero card
  - total quantity
  - remaining quantity
  - recipient rows
  - validation

### 7. Implement real assignment submit

- Replace the mock submit service with backend-backed assignment requests.
- Support the existing multi-row form by issuing one request per recipient row or by using the backend bulk request shape if confirmed safe.
- Invalidate inventory data after success.
- Navigate back to `/inventory` after success.

### 8. Add reassignment modal behavior

- Build an in-place modal for assigned rows.
- Add email validation using the existing app form stack.
- Submit `PUT /api/v1/inventory/{id}/assign`.
- Refresh inventory on success.

### 9. Keep failed rows read-only

- Render failed rows with the same scan-friendly structure as assigned rows where possible.
- Do not attach row actions beyond passive viewing in v1.

### 10. Remove obsolete mock-only wiring

- Remove or isolate the old mock-order assumptions from the inventory assignment route.
- Keep any remaining mock helpers only if they are still used elsewhere.

### 11. Verify

- Run:
  - `npm run lint`
  - `npm run build`
- Manually review on a mobile viewport first.
- Then check larger-screen behavior for:
  - tab layout
  - search placement
  - long email wrapping
  - grouped card spacing
  - modal fit and dismissal

## Risks and Dependencies

- The backend inventory payload must expose recipient email for assigned and failed rows.
- The backend should expose a meaningful event timestamp for accurate recency sort and display.
- If the backend response shape differs from these assumptions, the service normalization layer should absorb that difference without pushing response parsing into UI components.
