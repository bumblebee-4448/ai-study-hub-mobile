# Admin Mobile Real API Design

Date: 2026-06-20

## Context

The admin work in this app is mobile-only. The web admin implementation in the monorepo is useful as a reference for API contracts and workflow names, but it is not a frontend source of truth for the mobile app.

The current mobile admin tabs still contain mixed English labels and mock/placeholder screens:

- `Home`
- `Analytics`
- `Users`
- `Settings`

The target admin mobile surface is:

- `Trang chủ`
- `Người dùng`
- `Môn học`
- `Hồ sơ`

## Goals

- Make the admin mobile experience consistently Vietnamese.
- Replace admin mock data with real API calls.
- Keep admin mobile code feature-scoped under `features/admin`.
- Implement complete mobile admin workflows for users and subjects.
- Reuse the existing mobile profile flow for the admin profile tab.

## Non-Goals

- Do not port desktop web UI layouts or table-first interaction patterns into mobile.
- Do not add backend endpoints.
- Do not add admin analytics that the backend cannot currently support.
- Do not modify user or moderator mobile flows except where shared profile/auth code requires it.

## Mobile Admin Tabs

### Trang chủ

Use `GET /admin/dashboard` through the shared `apiClient`.

Display backend-backed counts:

- total, active, banned, and unverified accounts
- total subjects
- total, active, pending, and rejected documents

The dashboard can also load a small recent account list from `GET /accounts` for a quick overview. It should avoid mock metrics such as page views or discussion counts because no real backend source exists for those values.

### Người dùng

Use these API routes:

- `GET /accounts`
- `GET /accounts/:id`
- `POST /accounts`
- `PATCH /accounts/:accountId/ban`

Mobile behavior:

- show account cards instead of desktop tables
- search by name or email
- filter by role and status
- view account details
- create moderator accounts
- ban active non-admin accounts
- show loading, empty, and error states

### Môn học

Use these API routes:

- `GET /subjects`
- `GET /subjects/:id`
- `POST /subjects`
- `PATCH /subjects/:id`
- `DELETE /subjects/:id`

Mobile behavior:

- list subjects with search and pagination
- view subject details
- create subjects
- edit subject name/code
- delete subjects with confirmation
- show loading, empty, and error states

### Hồ sơ

Reuse the existing mobile profile implementation:

- `GET /auth/me`
- `PATCH /accounts/:id`

The admin tab should route to the existing profile screen so profile fetching, update, logout, and auth-store synchronization remain centralized.

## Architecture

Add an admin API layer inside the mobile admin feature:

- `features/admin/services/adminApi.ts` owns HTTP calls.
- `features/admin/services/adminMappers.ts` owns response normalization, labels, and formatting helpers.
- `features/admin/types.ts` owns admin-specific TypeScript contracts.
- Admin screens call the service layer instead of calling `apiClient` directly.

This keeps the mobile admin implementation independent from the web frontend while still matching backend contracts.

## Error Handling

- API calls should use `skipAlert: true` where screens need inline errors.
- Screens should display concise Vietnamese retry/error messages.
- Mutating actions should use `Alert.alert` for confirmation and success/failure feedback.
- Refresh-token behavior stays in the shared `apiClient`.

## Testing

Add focused mapper tests first:

- dashboard stats mapping tolerates missing values
- account mapping formats role/status/date labels
- subject mapping formats dates and preserves identifiers

Run:

- `node features/admin/services/adminMappers.test.mjs`
- `npm run lint`

## Design Approval

Approved by the user for mobile-only implementation using the feature-scoped admin API approach.
