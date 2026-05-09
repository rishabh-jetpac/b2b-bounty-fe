# Wallet Screen Implementation Plan

## Goal

Implement a mobile-first wallet screen for the authenticated React SPA, using the local Stitch wallet export as the base while simplifying it for the current mock-data phase.

Primary reference:

- `stitch_kiosk_data_rapid_portal/wallet_screen_minimal_history`

## Final Scope

### In scope

- Replace the current wallet placeholder route with a real wallet screen.
- Keep the screen mobile-first and visually aligned with the authenticated shell.
- Show a compact wallet balance card.
- Remove the top-up/add funds button from the wallet card.
- Use self-created mock wallet transactions.
- Render a static transaction history list.
- Show both `debit` and `credit` transaction states.
- Use transaction `type` to derive the pricing symbol and color.

### Out of scope

- Backend or API integration.
- React Query wallet fetching.
- Top-up actions or payment flows.
- Search or filtering on wallet history.
- Transaction detail screens.
- Keeping the wallet balance mathematically consistent with the mock transaction list.
- Syncing wallet state with the packs screen in this pass.

## UX Decisions Locked

### Header and page structure

- The route title remains `Wallet`.
- Do not show balance in the top app bar `rightText`.
- The wallet balance appears only inside the wallet card.
- Remove the search field from the Stitch reference.

### Wallet card

- Keep the balance card as the main colored hero section.
- Reduce the overall card height from the Stitch reference.
- Keep the internal spacing and typography visually consistent with the smaller card height.
- Show only:
  - balance label
  - balance amount
- Do not show:
  - top-up button
  - secondary actions
  - supporting helper text

### Transaction list

- The section remains a simple history list below the balance card.
- Cards are static and non-clickable.
- Do not show icons in transaction cards.
- Keep rows compact and scan-friendly.
- Order rows newest first.

### Transaction card content

- First line shows:
  - title
  - pricing
- Second line shows muted metadata:
  - `Txn ID: ...`
  - date
- Date is rendered as date only, not time.
- Pricing uses:
  - `-` for `debit`
  - `+` for `credit`
- Pricing color uses:
  - error red for `debit`
  - existing brand blue for `credit`

## Data Model

Mock transaction data should stay minimal and encode transaction direction through `type`, not signed numbers.

```ts
type WalletTransaction = {
  id: string
  title: string
  transactionId: string
  date: string
  amount: number
  type: 'debit' | 'credit'
}
```

### Notes

- `amount` stays positive in mock data.
- UI derives `+` or `-` from `type`.
- Mock balance is allowed to be independent from the mock history total in this phase.

## Formatting Rules

### Balance

- Reuse the existing currency formatting approach already used in the packs feature.
- Keep the balance display to two decimal places.

### History rows

- Format pricing as currency with symbol prefix from transaction type.
- Format date as a human-readable date only, for example `May 08, 2026`.
- Keep transaction ID text muted and labeled as `Txn ID: ...`.

## Implementation Plan

### 1. Replace the wallet placeholder route

- Update `src/routes/WalletRoute.tsx`.
- Replace placeholder copy with a real wallet screen layout.
- Keep the layout compatible with the authenticated shell and bottom navigation.

### 2. Create local mock wallet data

- Add a feature-scoped mock data module for wallet transactions.
- Include a small mixed dataset with both:
  - `debit`
  - `credit`
- Keep dataset size small but representative, around 5 to 7 rows.

### 3. Add wallet formatting helpers

- Reuse the existing shared currency formatting where practical.
- Add small wallet-specific helpers if needed for:
  - signed amount display
  - date formatting

### 4. Build the compact balance card

- Implement the colored hero card at the top of the wallet route.
- Reduce its height and internal spacing from the Stitch reference.
- Remove the top-up CTA completely.

### 5. Build the transaction history section

- Add the section heading and list container.
- Render cards from the mock transaction dataset in newest-first order.
- Use a two-line row layout with pricing aligned against title.
- Keep the visual treatment simple and non-interactive.

### 6. Apply transaction state styling

- Use `type` to derive:
  - pricing sign
  - pricing color
- Keep all non-pricing metadata in muted text.

### 7. Verify

- Run:
  - `npm run lint`
  - `npm run build`
- Manually review the wallet screen on a mobile viewport first.
- Then check for obvious spacing and density issues on larger screens.
