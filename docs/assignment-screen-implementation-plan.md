# Assignment Screen Implementation Plan

## Goal

Implement a mobile-first assignment screen for purchased packs, using the local Stitch assignment export as the base while keeping the current generic `/inventory` route unchanged.

Primary reference:

- `stitch_kiosk_data_rapid_portal/assignment_screen_icons_fixed`

## Final Scope

### In scope

- Add a new order-specific assignment route at `/inventory/:orderId`.
- Keep the existing `/inventory` screen unchanged.
- Replace the current local packs purchase success flow with navigation into the assignment flow.
- Generate a mock `order_id` on successful `Buy now`.
- Read order details through a mock order service shaped like `GET /order/{id}`.
- Prefill the assignment screen hero from order data:
  - `pack.displayName`
  - `quantity`
- Show compact quantity tiles for:
  - `Total Quantity`
  - `Remaining`
- Start the assignment form with one recipient row at quantity `1`.
- Support adding recipient rows.
- Support row-level quantity steppers.
- Prevent assigned quantity from exceeding the purchased total.
- Submit a mocked assignment payload shaped as:
  - `order_id`
  - `assignments: Array<{ email: string; quantity: number }>`
- On successful assignment:
  - show success feedback
  - navigate to `/inventory`
- `Assign later` returns to `/packs`.

### Out of scope

- Real backend integration for buy, order fetch, or assignment submit.
- Replacing the generic `/inventory` placeholder with an inventory list.
- Assignment history, reassignment, or edit flows.
- Persisting mock orders across refresh.
- Email existence checks or recipient lookup.
- Multi-step assignment review screens.
- Showing order timestamp in the hero card.

## API Contract Alignment

The assignment screen should be built around the future API response for:

```ts
type OrderResponse = {
  order_id: string
  pack: {
    catalog_id: string
    displayName: string
  }
  quantity: number
  timestamp: string
}
```

### Notes

- The current app should use a mock order service that returns this exact shape.
- `Buy now` should create a mock order record using this contract, then navigate to `/inventory/:orderId`.
- The assignment screen should fetch from the mock service by route param rather than relying on navigation state for pack details.

## UX Decisions Locked

### Routing and flow

- Keep `/inventory` as the existing placeholder route.
- Add the assignment flow as `/inventory/:orderId`.
- A successful mocked purchase from `/packs` should:
  - generate a mock `order_id`
  - create a mock order record
  - navigate to `/inventory/:orderId`
- `Assign later` should navigate back to `/packs`.
- Successful `Assign now` should navigate to `/inventory`.

### Hero card

- Reduce the visual height from the Stitch reference.
- Remove the `Active Inventory` eyebrow text entirely.
- Show only:
  - pack `displayName` as the main line
  - `Total Quantity` tile
  - `Remaining` tile
- Do not show:
  - timestamp
  - extra supporting copy
  - CTA buttons inside the hero

### Quantity semantics

- `Total Quantity` comes directly from `order.quantity`.
- Initial `Remaining` should equal `order.quantity`.
- `Remaining` should update from local form state on the assignment screen.
- `Remaining` is calculated as:
  - `order.quantity - sum(assignments.quantity)`

### Assignment form

- Start with one recipient row.
- The initial row quantity is `1`.
- Each row contains:
  - recipient email input
  - quantity stepper
  - remove action
- `Add Recipient` appends a new row only when quantity is still available to allocate.
- Each row stepper is capped so total allocated quantity never exceeds `Total Quantity`.
- Removing a row should release its quantity back into `Remaining`.

### Submission behavior

- `Assign now` should be a real mocked submit, not a placeholder CTA.
- Submit payload shape:

```ts
type AssignmentSubmitPayload = {
  order_id: string
  assignments: Array<{
    email: string
    quantity: number
  }>
}
```

- Successful submit should show success feedback and navigate to `/inventory`.

## Validation Rules

### Recipient rows

- Email is required for every row.
- Email should use the existing app form stack:
  - `react-hook-form`
  - `yup`
- Quantity per row must be at least `1`.
- Total assigned quantity must not exceed purchased quantity.

### CTA states

- `Assign now` should be disabled when:
  - any row email is invalid
  - total assigned quantity exceeds `Total Quantity`
  - there are no recipient rows
- `Add Recipient` should be disabled when `Remaining` is `0`.

## Data and State Plan

### Mock order module

- Add a feature-scoped mock order module under the assignment feature.
- It should support:
  - creating a mock order from a purchased pack and quantity
  - fetching a mock order by `order_id`

### Feature state split

- Keep pack purchase UI state local to the packs feature.
- Keep assignment form state local to the assignment feature.
- Do not introduce Zustand for this pass.
- Keep the API-shaped mock helpers in feature services so the future backend swap is localized.

## Implementation Plan

### 1. Create assignment feature structure

- Add a new feature folder for assignment UI and logic.
- Include:
  - screen component
  - mock order service
  - assignment submit mock service
  - form schema and helpers

### 2. Add order-specific routing

- Keep the existing `/inventory` route unchanged.
- Add a new authenticated route for `/inventory/:orderId`.
- Wire it to the new assignment screen component.

### 3. Add mock order creation in the packs flow

- Update the `Buy now` flow in the packs feature.
- Replace the current snackbar-only success path with:
  - mock order creation
  - route navigation to `/inventory/:orderId`
- Keep the existing insufficient-balance guard.

### 4. Add assignment mock services

- Implement a mock `getOrderById(orderId)` service shaped like `GET /order/{id}`.
- Implement a mock `submitAssignments(payload)` service.
- Keep the service API small and future-backend-friendly.

### 5. Build the reduced hero card

- Use the Stitch assignment screen as the structural reference.
- Reduce hero height and internal spacing.
- Render only:
  - pack `displayName`
  - `Total Quantity`
  - `Remaining`

### 6. Build the assignment rows

- Add a dynamic recipient row list.
- Start with one row at quantity `1`.
- Support add, remove, increment, and decrement interactions.
- Keep the form mobile-first and vertically stacked.

### 7. Add validation and submission handling

- Add `react-hook-form` with `yup` validation.
- Enforce valid email and quantity constraints.
- Prevent over-allocation.
- Submit the mocked payload on `Assign now`.

### 8. Add exit and success behavior

- `Assign later` navigates to `/packs`.
- On successful submit:
  - show success feedback
  - navigate to `/inventory`

### 9. Verify

- Run:
  - `npm run lint`
  - `npm run build`
- Manually review the assignment screen on a mobile viewport first.
- Then check for obvious larger-screen layout issues.

## Known Constraint

- Leaving `/inventory` unchanged means both:
  - the bottom-nav inventory destination
  - the post-submit redirect target

will still land on the current placeholder screen. That is acceptable for this pass because the explicit requirement is to leave the generic inventory screen alone.
