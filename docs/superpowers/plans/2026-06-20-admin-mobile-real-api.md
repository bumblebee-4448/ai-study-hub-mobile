# Admin Mobile Real API Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the mobile admin tabs `Trang chủ`, `Người dùng`, `Môn học`, and `Hồ sơ` on real backend APIs.

**Architecture:** Keep admin mobile code under `features/admin` with service and mapper boundaries. Screens consume admin services, while profile reuses the existing `features/profile` flow.

**Tech Stack:** Expo SDK 54, React Native 0.81, Expo Router, TypeScript, Axios via shared `apiClient`, Node-based mapper tests.

---

### Task 1: Admin API Types And Mappers

**Files:**
- Modify: `features/admin/types.ts`
- Create: `features/admin/services/adminMappers.ts`
- Create: `features/admin/services/adminMappers.test.mjs`

- [ ] **Step 1: Write mapper tests**

Create tests for dashboard, account, and subject normalization. The tests should import the mapper module and assert Vietnamese labels, date fallback behavior, and defensive default values.

- [ ] **Step 2: Run tests and verify RED**

Run: `node features/admin/services/adminMappers.test.mjs`

Expected: FAIL because `features/admin/services/adminMappers.ts` does not exist yet.

- [ ] **Step 3: Implement admin types and mappers**

Add backend contracts, mobile view models, role/status labels, date formatting, and response normalization helpers.

- [ ] **Step 4: Run mapper tests and verify GREEN**

Run: `node features/admin/services/adminMappers.test.mjs`

Expected: PASS.

### Task 2: Admin API Service

**Files:**
- Create: `features/admin/services/adminApi.ts`
- Modify: `features/admin/index.ts`

- [ ] **Step 1: Add service functions**

Create functions for dashboard stats, accounts list/detail/create/ban, and subjects list/detail/create/update/delete. Use `apiClient` and `skipAlert: true`.

- [ ] **Step 2: Export admin API**

Export the service and mapper utilities from `features/admin/index.ts` where useful.

### Task 3: Admin Routing And Tabs

**Files:**
- Modify: `app/(admin-tabs)/_layout.tsx`
- Modify: `app/(admin-tabs)/index.tsx`
- Modify: `app/(admin-tabs)/users.tsx`
- Add: `app/(admin-tabs)/subjects.tsx`
- Add: `app/(admin-tabs)/profile.tsx`
- Delete or hide route: `app/(admin-tabs)/analytics.tsx`
- Delete or hide route: `app/(admin-tabs)/settings.tsx`

- [ ] **Step 1: Update tab labels and icons**

Configure tabs as `Trang chủ`, `Người dùng`, `Môn học`, `Hồ sơ`.

- [ ] **Step 2: Wire route files**

Point `subjects.tsx` to the new subject screen and `profile.tsx` to the existing `ProfileScreen`.

- [ ] **Step 3: Remove old admin tab exposure**

Ensure `Analytics` and `Settings` are no longer visible admin tabs.

### Task 4: Dashboard Screen

**Files:**
- Modify: `features/admin/screens/DashboardScreen.tsx`

- [ ] **Step 1: Replace mock stats**

Load `fetchAdminDashboardStats()` and render real account, subject, and document counts.

- [ ] **Step 2: Add state handling**

Show loading, retry, empty-safe stats, and inline Vietnamese error states.

- [ ] **Step 3: Add recent users preview**

Load recent accounts from `fetchAdminAccounts()` and show a small preview list with navigation to the users tab.

### Task 5: User Management Screen

**Files:**
- Modify: `features/admin/screens/UsersScreen.tsx`

- [ ] **Step 1: Load users from API**

Use `fetchAdminAccounts()` and client-side search/filter for mobile.

- [ ] **Step 2: Add detail and create flows**

Use React Native modals for account detail and moderator creation.

- [ ] **Step 3: Add ban flow**

Confirm before calling `banAdminAccount()` and refresh/update local state after success.

### Task 6: Subject Management Screen

**Files:**
- Create: `features/admin/screens/SubjectsScreen.tsx`
- Modify: `features/admin/index.ts`

- [ ] **Step 1: Load subjects from API**

Use `fetchAdminSubjects()` with search and page state.

- [ ] **Step 2: Add detail, create, edit, delete flows**

Use mobile modals and confirmation alerts.

- [ ] **Step 3: Add empty/loading/error states**

Keep all copy in Vietnamese.

### Task 7: Verification

**Files:**
- Test: `features/admin/services/adminMappers.test.mjs`
- Test: project lint

- [ ] **Step 1: Run mapper tests**

Run: `node features/admin/services/adminMappers.test.mjs`

Expected: PASS.

- [ ] **Step 2: Run lint**

Run: `npm run lint`

Expected: exit 0.

- [ ] **Step 3: Review admin language**

Search admin files for exposed English labels and replace them with Vietnamese where they belong to admin mobile UI.
