# Create Subadmin Implementation Plan

## Goal

Add an admin-only action inside the authenticated account drawer that opens a protected create-subadmin flow. The new flow should mirror the current create-account form, but the organization is inherited from the logged-in admin, shown as locked and disabled, and the submission should call the new authenticated backend endpoint without replacing the current session.

Primary integration points:

- `src/app/AuthenticatedLayout.tsx`
- `src/app/router.tsx`
- `src/app/AuthGate.tsx`
- `src/routes/CreateAccountRoute.tsx`
- `src/store/authStore.ts`
- `src/features/auth/authSchemas.ts`
- `src/features/auth/services/authService.ts`
- `src/features/auth/hooks/useRegisterMutation.ts`

## Current State

- The account drawer already exists in the authenticated shell.
- The drawer currently shows email, organization, role, and logout only.
- `/create-account` is a guest-only route for self-serve account creation.
- The current create-account screen collects:
  - organization name
  - email
  - password
  - confirm password
- The current registration flow calls `POST /auth/register`.
- The current registration mutation may persist a returned token and switch the active session.
- There is no role-gated route logic beyond authenticated vs guest users.
- There is no existing subadmin API service or mutation hook.

## Locked Product Decisions

### Drawer action

- Add a new drawer action labeled `Create Subadmin User`.
- Show this action only when `user.role === 'admin'`.
- Do not show the action for any other role.

### Route and shell

- Add a new protected route at `/create-subadmin`.
- Keep the existing public `/create-account` flow unchanged.
- Render the new screen inside the authenticated app shell, not the guest auth layout.
- Hide bottom navigation on the create-subadmin screen.
- Set the authenticated header title to `Create Subadmin User`.

### Access control

- Treat only the exact role string `admin` as authorized.
- If a non-admin manually opens `/create-subadmin`, redirect them to `/packs`.
- UI hiding in the drawer is not sufficient by itself; the route must also be guarded.

### Form behavior

- Reuse the current create-account field structure where practical.
- Show organization as a prefilled disabled field using the current admin's `user.orgName`.
- Keep `Confirm Password` even though the API only requires `email` and `password`.
- Submit only:
  - `email`
  - `password`
- Do not submit `org_name`; the backend infers organization from the authenticated admin.

### Success behavior

- On success, stay on the create-subadmin screen.
- Show a success message.
- Clear the password and confirm-password fields.
- Keep the locked organization visible.
- Do not replace the current admin session.

## Backend Contract

### Endpoint

```http
POST /api/v1/auth/sub-admins
Authorization: Bearer <token>
Content-Type: application/json
```

### Authorization

- Admin only.

### Request body

```json
{
  "email": "subadmin@acme.com",
  "password": "secret"
}
```

### Response handling assumption

- Treat any 2xx response as success.
- Do not expect or process a new auth token.
- Do not modify persisted auth state after a successful subadmin creation.

## Technical Approach

### Route protection strategy

- Keep `ProtectedRoute` responsible for authentication only.
- Add a small admin-only route guard for exact role enforcement on `/create-subadmin`.
- Reuse `useAuthStore` as the source of truth for the current user role.

### Service and mutation boundary

- Do not reuse `useRegisterMutation` for subadmin creation.
- Add a dedicated authenticated service function for subadmin creation.
- Add a dedicated mutation hook that:
  - calls the new endpoint
  - does not persist a token
  - exposes pending, success, and error state to the screen

### Form reuse strategy

- Preserve the current public create-account behavior.
- Extract only the reusable parts that materially reduce duplication.
- Prefer a shared schema or field block for:
  - email
  - password
  - confirm password
- Keep org-name behavior mode-specific so the public and admin flows remain easy to reason about.

## Implementation Plan

### 1. Add an admin-only route guard

- Create a guard component in `src/app/AuthGate.tsx` or a nearby app-level auth module.
- Allow rendering only when:
  - the app is hydrated
  - the user is authenticated
  - `user.role === 'admin'`
- Redirect unauthorized authenticated users to `/packs`.

### 2. Register the protected route

- Add `CreateSubadminRoute` to `src/app/router.tsx`.
- Place it under the authenticated shell so it renders inside `AuthenticatedLayout`.
- Wrap the route with the admin-only guard.

### 3. Add the drawer action

- Update `src/app/AuthenticatedLayout.tsx`.
- Render a drawer action button or list-style action labeled `Create Subadmin User`.
- Show it only for admins.
- Navigate to `/create-subadmin` and close the drawer when triggered.

### 4. Add subadmin API types and service

- Extend `src/features/auth/types.ts` with:
  - `CreateSubadminRequest`
  - optional response envelope type if needed
- Add a service function in `src/features/auth/services/authService.ts`:
  - `createSubadmin(request)`
- Call `apiClient.post('/api/v1/auth/sub-admins', request)`.

### 5. Add a dedicated mutation hook

- Create `src/features/auth/hooks/useCreateSubadminMutation.ts`.
- Keep it separate from registration.
- Ensure it does not call `setSessionFromToken`.
- Return the mutation result directly to the screen for local success-state handling.

### 6. Add admin-specific form schema support

- Update `src/features/auth/authSchemas.ts` to support the new screen cleanly.
- Keep public create-account validation unchanged.
- Reuse the existing email/password/confirm-password rules.
- Treat organization as display-only on the subadmin screen, not a submitted field.

### 7. Build the screen

- Add a new route component at `src/routes/CreateSubadminRoute.tsx`.
- Use the authenticated shell via the router.
- Use `useAuthenticatedHeader({
  title: 'Create Subadmin User',
  hideBottomNavigation: true,
})`.
- Prefill organization from `useAuthStore((state) => state.user?.orgName)`.
- Render:
  - disabled organization field
  - email field
  - password field
  - confirm-password field
- On submit:
  - reset prior mutation state
  - call the create-subadmin mutation with `email` and `password`
  - show success feedback
  - clear password fields
  - keep organization and email behavior aligned with the decided UX

### 8. Add success and error feedback

- Show an inline success `Alert` or `Snackbar` after successful creation.
- Show API errors through the existing `getApiErrorMessage` helper.
- Keep the success state screen-local; no global store is needed.

### 9. Preserve the public create-account flow

- Leave `/create-account` guest-only.
- Keep the footer link from login to create-account unchanged unless product direction changes later.
- Do not route admins through the public registration endpoint for subadmin creation.

## File Plan

- Add `src/routes/CreateSubadminRoute.tsx`
- Add `src/features/auth/hooks/useCreateSubadminMutation.ts`
- Update `src/app/router.tsx`
- Update `src/app/AuthGate.tsx`
- Update `src/app/AuthenticatedLayout.tsx`
- Update `src/features/auth/services/authService.ts`
- Update `src/features/auth/types.ts`
- Update `src/features/auth/authSchemas.ts`
- Optionally add a small shared auth-form helper if duplication becomes excessive

## Risks

- If the subadmin flow accidentally reuses the registration mutation, a successful request could overwrite the active admin session.
- If the route is only hidden in the drawer but not guarded directly, non-admin users could still navigate to it manually.
- If role checks use fuzzy matching instead of exact equality, future roles could inherit admin UI incorrectly.
- If the disabled organization field is wired into validation incorrectly, the form may block submission or submit unused data.
- If success handling assumes a response body that the backend does not return, the UX may falsely report failure after a valid 2xx response.

## Verification

- Run `npm run lint`
- Run `npm run build`
- Manually verify on a mobile viewport first
- Confirm:
  - admins see `Create Subadmin User` in the drawer
  - non-admins do not see the action
  - non-admins are redirected away from `/create-subadmin`
  - the screen uses the authenticated shell and hides bottom navigation
  - organization is visible, prefilled, disabled, and matches the current admin
  - submit sends only `email` and `password` to `/api/v1/auth/sub-admins`
  - success does not change the current login session
  - success clears password fields and shows confirmation
  - API failures render the expected error message
