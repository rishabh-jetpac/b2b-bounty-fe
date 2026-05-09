# Account Drawer Implementation Plan

## Goal

Implement a mobile-first authenticated account drawer in the existing app shell so signed-in users can open a burger menu, see their account identity, and log out cleanly.

Primary integration points:

- `src/app/AuthenticatedLayout.tsx`
- `src/store/authStore.ts`
- `src/app/providers.tsx`
- `src/app/AuthGate.tsx`

## Final Scope

### In scope

- Add a burger icon to the left side of the authenticated header.
- Open a full-height temporary drawer from the left side.
- Show a top account card in the drawer with:
  - user email
  - organization name
- Keep the existing screen title and `rightText` behavior intact.
- Keep the drawer account-focused only.
- Add a logout button pinned to the bottom of the drawer.
- On logout:
  - close the drawer
  - clear the persisted access token and auth session
  - clear React Query cached data
  - navigate to `/login` with `replace: true`
- Auto-close the drawer on route change.

### Out of scope

- Adding route links inside the drawer.
- Showing role, user id, or org id in the drawer UI.
- Adding a logout confirmation dialog.
- Backend logout API integration.
- Desktop-specific permanent sidebar behavior.
- Reworking the bottom navigation.

## UX Decisions Locked

### Header behavior

- The burger trigger lives on the far left of the authenticated header.
- The drawer opens from the left.
- The existing `title` remains in the header.
- Existing `rightText` remains on the right side when a screen uses it.
- The new drawer entry point should not replace the packs balance display.

### Drawer behavior

- Use a full-height temporary drawer, not a compact content-height panel.
- The drawer is an account panel, not a second navigation system.
- The drawer should close when:
  - the user taps outside it
  - the user uses an explicit close affordance if one is present
  - the route changes
  - logout is triggered

### Account content

- Show only:
  - user email
  - organization name
- Do not show:
  - role
  - avatar
  - route links
  - secondary actions

### Logout behavior

- Logout acts immediately with no confirmation step.
- The logout button is pinned to the bottom of the drawer.
- Logout must clear both:
  - auth session state
  - React Query cache

## Data Sources

The drawer should read identity data from the existing authenticated store state.

```ts
type AuthUser = {
  email: string
  exp: number
  orgId: string
  orgName: string
  role: string
  userId: string
}
```

### Notes

- Drawer UI should consume `user.email` and `user.orgName`.
- Access token storage remains owned by `authStore`.
- Token clearing should continue to be centralized through `clearSession()`.

## Technical Constraints

### Query client ownership

- `QueryClient` is currently created inside `src/app/providers.tsx`.
- The logout flow needs access to that same client instance.
- The implementation should expose the shared query client through a small app-level module or another simple shared access point.

### Route protection

- Protected routes are already enforced through `src/app/AuthGate.tsx`.
- Explicit navigation to `/login` on logout should remain even though the auth guard would also redirect after session clear.

## Implementation Plan

### 1. Update the authenticated header layout

- Modify `src/app/AuthenticatedLayout.tsx`.
- Add a left-side `IconButton` for the burger trigger.
- Keep the current title and `rightText` layout working on narrow screens.
- Add local drawer open/close state to the authenticated shell.

### 2. Build the account drawer UI

- Use MUI `Drawer` with `anchor="left"`.
- Make it full height.
- Add a top account card styled consistently with the existing shell.
- Render:
  - email
  - organization name
- Structure the drawer content so the logout action can sit at the bottom reliably.

### 3. Add drawer lifecycle behavior

- Close the drawer on outside click and explicit dismiss.
- Observe route changes via `useLocation`.
- Auto-close the drawer whenever the pathname changes.

### 4. Expose the shared query client

- Move `QueryClient` creation to a small shared app module if needed.
- Keep `AppProviders` using that shared instance.
- Make the same client available to the logout action so cache clearing is centralized and deterministic.

### 5. Implement logout handling

- Use the existing auth store session clearing path.
- In the logout handler:
  - close the drawer
  - clear the auth session
  - clear the React Query cache
  - navigate to `/login` with `replace: true`

### 6. Verify auth-shell behavior

- Confirm protected routes still render correctly after shell changes.
- Confirm the drawer displays decoded identity from the current session.
- Confirm logout removes access to authenticated routes immediately.

### 7. Verify

- Run:
  - `npm run lint`
  - `npm run build`
- Manually review on a mobile viewport first.
- Verify:
  - packs header still shows balance on the right
  - drawer opens from the left
  - email and organization name appear in the top card
  - logout clears the session and returns to `/login`

## Risks

- Header spacing may get tight on `/packs` because the shell now needs to fit:
  - burger button
  - title
  - balance text
- If logout does not clear React Query cache, protected data may flash after the next login.
- If the drawer does not auto-close on route change, the shell can feel stuck or inconsistent on mobile.
