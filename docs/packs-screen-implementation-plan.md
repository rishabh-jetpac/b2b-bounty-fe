# Packs Screen Implementation Plan

## Goal

Implement a mobile-first authenticated packs purchase flow for the React SPA, using the local Stitch export as the base and the referenced Figma node for the purchase-sheet treatment.

Primary references:

- `stitch_kiosk_data_rapid_portal/packs_screen_minimal_selection`
- `stitch_kiosk_data_rapid_portal/purchase_bottom_sheet_normal_refined`
- Figma node `6763:49956` from file `lITmpXKDSAMPWfns4DXaDC`

## Final Scope

### In scope

- Add a new authenticated app shell with bottom navigation.
- Make `/packs` the default authenticated route.
- Keep `History` and `Wallet` as navigable placeholder routes.
- Navigate to `/packs` after successful local submit from:
  - `/login`
  - `/create-account`
- Build a packs list using local mock data only.
- Add country, validity, and GB filters.
- Open a purchase bottom sheet when a pack is selected.
- Support quantity changes in the sheet.
- Block purchase when balance is insufficient.
- On successful local purchase:
  - deduct balance
  - close the sheet
  - show a temporary success snackbar

### Out of scope

- Real auth or backend integration.
- React Query-backed pack fetching.
- Updating `History` or `Wallet` placeholders with purchase state.
- Search, sort controls, or category tabs.
- Pack images.
- Discount badges, callout strips, or upsell messaging.
- Descriptions in the list or purchase sheet.

## UX Decisions Locked

### Shell and navigation

- Add an authenticated shell with:
  - top app bar
  - bottom navigation
- Bottom nav tabs:
  - `Packs`
  - `History`
  - `Wallet`
- `Packs` is the only production-ready screen in this pass.
- `History` and `Wallet` are placeholders, but should still be routable and visually consistent.

### Packs screen

- Top bar shows:
  - title
  - wallet balance on the right
- Initial state has no selected pack.
- Selecting a pack opens the bottom sheet and resets quantity to `1`.
- Pack cards stay minimal and scan-friendly.

### Card content

- Show `countryInfo.display_name` as small supporting text.
- Show pack `name` as the main label.
- Show `validityInDays` on the card.
- Show only the final selling price.
- Do not show:
  - description
  - list price
  - discount hint
  - image

### Purchase sheet

- Combine local Stitch structure with the referenced Figma purchase layout.
- Keep the compact quantity stepper and full-width CTA.
- Remove all discount or buy-more messaging.
- CTA label is fixed to `Buy now`.
- Sheet content should include:
  - pack name
  - validity
  - final price
  - quantity stepper
  - insufficient-balance helper when needed

### Purchase result

- Purchase succeeds locally only when `balance >= finalPrice * quantity`.
- On success:
  - subtract total cost from balance
  - close sheet
  - clear current selection
  - show snackbar feedback
- Stay on `/packs`.

## Data Model

Mock data should include only the fields needed by the UI and filter logic.

```ts
type CountryInfo = {
  display_name: string
  code: string
}

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
  countryInfo?: CountryInfo
}
```

### Notes

- `dataInGB = -1` maps to user-facing `Unlimited`.
- `countryInfo` is included for country labeling and filtering.
- Filter values are derived dynamically from the mock dataset at runtime.

## Filtering

### Filter row

- Add three compact chips above the pack list:
  - `Country`
  - `Validity`
  - `GB`
- When active, each chip label changes to the selected value.
- If any filter is active, show a `Clear all` control.

### Filter interaction

- Each chip opens its own reusable bottom sheet.
- Each filter dimension is single-select.
- Filters combine with AND logic across dimensions.
- Default state has no filters applied.

### Option derivation

- Derive filter values from the full dataset, not from the already filtered result set.
- Do not pre-seed filter options.

### Option rules

- `Country`
  - derived from `countryInfo.display_name`
  - supports the default unselected state
  - no hardcoded `Global` value unless present in data
- `Validity`
  - exact values derived from data
  - labels use `N days`
- `GB`
  - numeric values derived from data
  - `-1` becomes `Unlimited`

### Empty results

- If filters yield zero packs:
  - keep active chips visible
  - show a compact empty state
  - include `Clear filters`

## Implementation Plan

### 1. Add authenticated app structure

- Create a shared authenticated layout under `src/app` or `src/features`.
- Add routes for:
  - `/packs`
  - `/history`
  - `/wallet`
- Update root redirects so authenticated navigation lands on `/packs`.

### 2. Wire auth forms into the shell

- Replace local success-alert completion flow in:
  - `src/routes/LoginRoute.tsx`
  - `src/routes/CreateAccountRoute.tsx`
- On successful submit, navigate to `/packs`.

### 3. Create local mock packs module

- Add a feature-scoped mock data file for packs.
- Normalize the raw source shape into the minimal UI shape above.
- Include enough sample records to exercise:
  - multiple countries
  - multiple validity values
  - numeric GB values
  - at least one unlimited pack

### 4. Add client-side purchase state

- Track:
  - current balance
  - selected pack
  - selected quantity
  - active filters
  - snackbar state
- Keep this local to the packs feature unless shared state pressure emerges.
- Zustand is optional, not required for the first implementation.

### 5. Build the packs route UI

- Implement the top bar with title and balance.
- Render the filter row.
- Render the filtered pack list in dataset order.
- Add selected/unselected card states.

### 6. Build reusable filter sheet UI

- Single reusable bottom-sheet component.
- Configure it per dimension:
  - country
  - validity
  - GB
- Support:
  - choose one value
  - clear current value
  - dismiss without changes

### 7. Build the purchase bottom sheet

- Match the combined design direction:
  - Stitch screen for overall shell behavior
  - Figma node for quantity-and-CTA composition
- Add quantity decrement/increment.
- Prevent quantity below `1`.
- Disable `Buy now` when funds are insufficient.

### 8. Add success feedback

- Use a temporary snackbar.
- Message format should confirm pack and quantity.

### 9. Add placeholder routes

- Create lightweight `History` and `Wallet` placeholders that:
  - fit the authenticated shell
  - are clearly not fully implemented yet
- Do not connect them to purchase state in this pass.

### 10. Verify

- Run:
  - `npm run lint`
  - `npm run build`
- Manually review mobile viewport first.
- Then check obvious larger-screen behavior.

## Styling Notes

- Stay inside the existing MUI + theme approach.
- Reuse tokens from `src/colors.ts`.
- Keep the design mobile-first.
- Preserve the established typography:
  - Lexend for headings/labels where appropriate
  - Inter for body/data
- Avoid introducing hardcoded colors where existing tokens fit.

## Non-Goals To Protect Against Scope Drift

- No backend API layer.
- No persistent purchase history.
- No wallet ledger implementation.
- No search bar.
- No implicit sorting rules.
- No pack image treatment.
- No promotional discount UI.
