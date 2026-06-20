# Mobile Dark Mode Theme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a persisted dark mode setting to the Expo mobile app and replace hardcoded light colors across the app with theme-aware semantic colors.

**Architecture:** Keep theme state in a small shared `features/theme` feature using Zustand `persist` and the existing `secureStorageService`. Resolve `system | light | dark` into a semantic app palette, feed it into React Navigation, Expo system UI, tab bars, reusable themed hooks/components, and then migrate screen colors by role/feature area.

**Tech Stack:** Expo SDK 54, Expo Router 6, React Native 0.81, TypeScript, Zustand 5 persist middleware, `expo-system-ui`, Node test runner for pure resolver tests.

---

## Current Checkpoint

The dark mode work is already partially implemented in this working tree. The repo is dirty from both this theme slice and earlier admin/mobile real API work, so every task should inspect per-file diffs before editing or staging.

Known theme files already started:
- `features/theme/services/themeResolver.ts`
- `features/theme/services/themeResolver.test.mjs`
- `features/theme/store/themeStore.ts`
- `features/theme/hooks/useAppTheme.ts`
- `features/theme/index.ts`
- `hooks/use-theme-color.ts`
- `constants/theme.ts`
- `app/_layout.tsx`
- role tab layouts under `app/(student-tabs)`, `app/(moderator-tabs)`, `app/(admin-tabs)`
- `features/profile/screens/ProfileScreen.tsx`

## File Structure

- Modify: `app.json`
- Modify: `app/_layout.tsx`
- Modify: `app/(student-tabs)/_layout.tsx`
- Modify: `app/(moderator-tabs)/_layout.tsx`
- Modify: `app/(admin-tabs)/_layout.tsx`
- Modify: `constants/theme.ts`
- Modify: `hooks/use-theme-color.ts`
- Modify: `components/parallax-scroll-view.tsx`
- Modify: `components/ui/collapsible.tsx`
- Create: `features/theme/index.ts`
- Create: `features/theme/services/themeResolver.ts`
- Create: `features/theme/services/themeResolver.test.mjs`
- Create: `features/theme/store/themeStore.ts`
- Create: `features/theme/hooks/useAppTheme.ts`
- Modify: `features/profile/screens/ProfileScreen.tsx`
- Modify: `features/profile/screens/EditProfileScreen.tsx`
- Modify: `features/auth/screens/LoginScreen.tsx`
- Modify: `features/auth/screens/RegisterScreen.tsx`
- Modify: `features/user/components/UserScreenHeader.tsx`
- Modify: `features/user/components/MyDocStatsCard.tsx`
- Modify: `features/user/components/MyDocumentItem.tsx`
- Modify: `features/user/components/UserDocumentList.tsx`
- Modify: `features/user/screens/UserHomeScreen.tsx`
- Modify: `features/user/screens/UserLibraryScreen.tsx`
- Modify: `features/user/screens/UserMyDocumentsScreen.tsx`
- Modify: `features/user/screens/UserContributeScreen.tsx`
- Modify: `features/document/screens/DocumentDetailScreen.tsx`
- Modify: `features/document/screens/EditDocumentScreen.tsx`
- Modify: `features/document/screens/ModeratorDashboardScreen.tsx`
- Modify: `features/document/screens/ModeratorReviewScreen.tsx`
- Modify: `features/document/screens/ModeratorDocumentDetailScreen.tsx`
- Modify: `features/admin/components/AdminHeader.tsx`
- Modify: `features/admin/components/GrowthChart.tsx`
- Modify: `features/admin/components/StatsCard.tsx`
- Modify: `features/admin/components/UserListItem.tsx`
- Modify: `features/admin/screens/DashboardScreen.tsx`
- Modify: `features/admin/screens/UsersScreen.tsx`
- Modify: `features/admin/screens/SubjectsScreen.tsx`

Before editing a dirty file, run:

```powershell
git diff -- <path>
```

## Task 1: Theme Resolver And Persisted Store

**Files:**
- Create: `features/theme/services/themeResolver.test.mjs`
- Create: `features/theme/services/themeResolver.ts`
- Create: `features/theme/store/themeStore.ts`
- Create: `features/theme/hooks/useAppTheme.ts`
- Create: `features/theme/index.ts`

- [ ] **Step 1: Verify resolver test exists**

Run:

```powershell
Get-Content -Raw features/theme/services/themeResolver.test.mjs
```

Expected: test covers explicit `light`, explicit `dark`, `system` fallback, and contrast between light/dark app colors.

- [ ] **Step 2: Run resolver test**

Run:

```powershell
node --experimental-strip-types features/theme/services/themeResolver.test.mjs
```

Expected: PASS. `MODULE_TYPELESS_PACKAGE_JSON` warning is acceptable in this repo.

- [ ] **Step 3: Confirm semantic palette shape**

Open `features/theme/services/themeResolver.ts` and confirm these exports exist:

```ts
export type ThemePreference = "system" | "light" | "dark";
export type ResolvedThemeScheme = "light" | "dark";
export const THEME_PREFERENCE_LABELS: Record<ThemePreference, string>;
export const APP_THEME_COLORS: Record<ResolvedThemeScheme, AppThemeColors>;
export function resolveThemePreference(...): ResolvedThemeScheme;
export function getAppTheme(scheme: ResolvedThemeScheme): AppTheme;
```

Required semantic colors:

```ts
primary;
primaryMuted;
onPrimary;
success;
successMuted;
warning;
warningMuted;
danger;
dangerMuted;
background;
surface;
surfaceRaised;
surfaceMuted;
surfaceSubtle;
text;
textMuted;
textSubtle;
border;
borderStrong;
icon;
overlay;
shadow;
inverseSurface;
inverseText;
tabActive;
tabInactive;
```

- [ ] **Step 4: Confirm Zustand store uses persist**

Open `features/theme/store/themeStore.ts` and confirm:

```ts
persist(..., {
  name: "theme-storage",
  storage: createJSONStorage(() => secureStorageService),
  partialize: (state) => ({ preference: state.preference }),
})
```

- [ ] **Step 5: Confirm app hook resolves system preference**

Open `features/theme/hooks/useAppTheme.ts` and confirm it combines:

```ts
useColorScheme()
useThemeStore((state) => state.preference)
resolveThemePreference(preference, systemScheme)
getAppTheme(scheme)
```

## Task 2: Root Theme Wiring

**Files:**
- Modify: `app.json`
- Modify: `app/_layout.tsx`
- Modify: `constants/theme.ts`
- Modify: `hooks/use-theme-color.ts`
- Modify: `app/(student-tabs)/_layout.tsx`
- Modify: `app/(moderator-tabs)/_layout.tsx`
- Modify: `app/(admin-tabs)/_layout.tsx`

- [ ] **Step 1: Configure Expo system UI plugin**

In `app.json`, ensure plugins include:

```json
"expo-system-ui"
```

`userInterfaceStyle` should remain:

```json
"automatic"
```

- [ ] **Step 2: Wire React Navigation theme**

In `app/_layout.tsx`, use `useAppTheme()` and build a navigation theme:

```ts
colors: {
  primary: colors.primary,
  background: colors.background,
  card: colors.surface,
  text: colors.text,
  border: colors.border,
  notification: colors.danger,
}
```

Also set:

```ts
SystemUI.setBackgroundColorAsync(colors.background)
<StatusBar style={isDark ? "light" : "dark"} backgroundColor={colors.background} />
```

- [ ] **Step 3: Make tab bar options dynamic**

In `constants/theme.ts`, export:

```ts
export const getCommonTabBarOptions = (colors: AppThemeColors) => ({ ... });
```

Each role layout should call:

```ts
const { colors } = useAppTheme();
<Tabs screenOptions={getCommonTabBarOptions(colors)}>
```

- [ ] **Step 4: Route legacy themed components through app theme**

In `hooks/use-theme-color.ts`, replace raw system scheme usage with:

```ts
const { scheme } = useAppTheme();
```

In `components/parallax-scroll-view.tsx` and `components/ui/collapsible.tsx`, use `useAppTheme()` instead of raw `useColorScheme()` where app preference matters.

## Task 3: Profile Theme Control

**Files:**
- Modify: `features/profile/screens/ProfileScreen.tsx`
- Modify: `features/profile/screens/EditProfileScreen.tsx`

- [ ] **Step 1: Add theme selector to profile**

In `ProfileScreen.tsx`, use:

```ts
const { colors, preference, setThemePreference } = useAppTheme();
```

Add a segmented control in the existing `CÀI ĐẶT` section with options:

```ts
system;
light;
dark;
```

Use labels:

```ts
Theo hệ thống;
Sáng;
Tối;
```

- [ ] **Step 2: Make profile and edit profile theme-aware**

Convert static `StyleSheet.create` into:

```ts
const createStyles = (colors: AppThemeColors) => StyleSheet.create({ ... });
const styles = useMemo(() => createStyles(colors), [colors]);
```

Use semantic tokens:

```ts
colors.background;
colors.surface;
colors.surfaceMuted;
colors.primary;
colors.primaryMuted;
colors.text;
colors.textSubtle;
colors.border;
colors.danger;
colors.dangerMuted;
```

## Task 4: Auth Screens

**Files:**
- Modify: `features/auth/screens/LoginScreen.tsx`
- Modify: `features/auth/screens/RegisterScreen.tsx`

- [ ] **Step 1: Add theme hook**

In both files:

```ts
const { colors } = useAppTheme();
const styles = useMemo(() => createStyles(colors), [colors]);
```

- [ ] **Step 2: Replace static design colors**

Replace `COLORS.background`, `COLORS.surface`, `COLORS["on-surface"]`, and `COLORS["outline-variant"]` with semantic palette values.

Keep provider brand colors:

```ts
#EA4335
#1877F2
```

Those are intentional Google/Facebook colors, not theme surface colors.

## Task 5: Student Screens And Components

**Files:**
- Modify: `features/user/components/UserScreenHeader.tsx`
- Modify: `features/user/components/MyDocStatsCard.tsx`
- Modify: `features/user/components/MyDocumentItem.tsx`
- Modify: `features/user/components/UserDocumentList.tsx`
- Modify: `features/user/screens/UserHomeScreen.tsx`
- Modify: `features/user/screens/UserLibraryScreen.tsx`
- Modify: `features/user/screens/UserMyDocumentsScreen.tsx`
- Modify: `features/user/screens/UserContributeScreen.tsx`

- [ ] **Step 1: Convert shared user components**

Use `useAppTheme()` inside shared user components. Replace card, text, border, icon, and empty-state hardcodes with semantic tokens.

Status and format badges should use:

```ts
colors.successMuted;
colors.successText;
colors.warningMuted;
colors.warningText;
colors.dangerMuted;
colors.dangerText;
colors.primaryMuted;
colors.primary;
colors.surfaceSubtle;
```

- [ ] **Step 2: Convert student screens**

For each screen, use:

```ts
const { colors } = useAppTheme();
const styles = useMemo(() => createStyles(colors), [colors]);
```

Replace these common hardcoded values:

```ts
#f8fafc -> colors.background or colors.surfaceMuted
#ffffff / white -> colors.surface
#0f172a -> colors.text
#64748b / #94a3b8 -> colors.textSubtle
#e2e8f0 / #f1f5f9 -> colors.border
#6366f1 / #004ac6 -> colors.primary
```

- [ ] **Step 3: Preserve intentional accent colors**

Keep meaningful accent use only when attached to a semantic state or file type. Prefer theme tokens over raw literals.

## Task 6: Document Screens

**Files:**
- Modify: `features/document/screens/DocumentDetailScreen.tsx`
- Modify: `features/document/screens/EditDocumentScreen.tsx`

- [ ] **Step 1: Convert document detail**

Remove static `COLORS` usage from `DocumentDetailScreen.tsx`. Use `useAppTheme()` and `createStyles(colors)`.

Pass theme values into helper components such as `RelatedDocumentCard` when they use icon/text/card colors.

- [ ] **Step 2: Convert edit document**

Remove static `COLORS` usage from `EditDocumentScreen.tsx`. Use theme colors for header, inputs, preview card, modal, save button, delete button, and overlay.

- [ ] **Step 3: Verify no remaining static colors in these files**

Run:

```powershell
rg -n "COLORS|#[0-9A-Fa-f]{3,8}|rgba?\\(" features/document/screens/DocumentDetailScreen.tsx features/document/screens/EditDocumentScreen.tsx
```

Expected: no hits, unless a future intentionally branded color is added with an inline comment.

## Task 7: Moderator Screens

**Files:**
- Modify: `features/document/screens/ModeratorDashboardScreen.tsx`
- Modify: `features/document/screens/ModeratorReviewScreen.tsx`
- Modify: `features/document/screens/ModeratorDocumentDetailScreen.tsx`
- Modify: `app/moderator-review.tsx`

- [ ] **Step 1: Convert moderator dashboard**

Use `useAppTheme()` and `createStyles(colors)`. Pass status colors to `StatsCard` from theme:

```ts
colors.success;
colors.warning;
colors.danger;
```

- [ ] **Step 2: Convert review queue**

Make filters, cards, status badges, error state, empty state, load more, and refresh controls theme-aware.

- [ ] **Step 3: Convert document detail**

Make preview, metadata cards, rejection reason, action bar, reject modal, and text input theme-aware.

- [ ] **Step 4: Convert stack back icon**

In `app/moderator-review.tsx`, use:

```ts
const { colors } = useAppTheme();
<Ionicons name="chevron-back" color={colors.text} />
```

## Task 8: Admin Shared Components And Screens

**Files:**
- Modify: `features/admin/components/AdminHeader.tsx`
- Modify: `features/admin/components/GrowthChart.tsx`
- Modify: `features/admin/components/StatsCard.tsx`
- Modify: `features/admin/components/UserListItem.tsx`
- Modify: `features/admin/screens/DashboardScreen.tsx`
- Modify: `features/admin/screens/UsersScreen.tsx`
- Modify: `features/admin/screens/SubjectsScreen.tsx`

- [ ] **Step 1: Convert admin shared components**

Use `useAppTheme()` in:

```ts
AdminHeader;
GrowthChart;
StatsCard;
UserListItem;
```

Keep `StatsCard.isDark` as a visual emphasis mode, but derive its colors from the current palette:

```ts
colors.inverseSurface;
colors.inverseText;
colors.surface;
colors.text;
```

- [ ] **Step 2: Convert dashboard**

Use theme-aware styles for header, state boxes, summary grid, recent user rows, and status badges.

- [ ] **Step 3: Convert UsersScreen**

Because `UsersScreen.tsx` contains nested local components, each local component may call `useAppTheme()` and `createStyles(colors)` locally to avoid changing many prop signatures.

Required local components:

```ts
FilterGroup;
UserCard;
UserDetailModal;
CreateUserModal;
FormInput;
DetailRow;
```

- [ ] **Step 4: Convert SubjectsScreen**

Follow the same approach as `UsersScreen.tsx`. Replace search, chips, cards, modal backdrop, modal card, inputs, detail rows, primary/delete buttons, and state boxes with semantic colors.

## Task 9: Hardcoded Color Audit

**Files:**
- Audit all `*.ts` and `*.tsx` files.

- [ ] **Step 1: Search hardcoded colors**

Run:

```powershell
rg -n '#[0-9A-Fa-f]{3,8}|rgba?\\(|"white"|''white''|"black"|''black''' -g "*.ts" -g "*.tsx" --glob "!node_modules"
```

- [ ] **Step 2: Classify each hit**

Allowed hits:

```ts
constants/theme.ts palette definitions;
brand colors such as Google/Facebook;
transparent overlays that intentionally use rgba;
static test expectations for palette values;
asset/adaptive icon colors in app.json;
status/accent values only if they are defined in the theme palette;
```

Everything else should move to `useAppTheme()` or `APP_THEME_COLORS`.

- [ ] **Step 3: Search raw system color scheme usage**

Run:

```powershell
rg -n "useColorScheme|COMMON_TAB_BAR_OPTIONS|COLORS\\.|theme\\.colors" -g "*.ts" -g "*.tsx"
```

Expected: no raw `useColorScheme` for user-facing theme decisions outside the theme hook or web hydration shim.

## Task 10: Verification

**Files:**
- Verify all touched files.

- [ ] **Step 1: Run focused resolver test**

Run:

```powershell
node --experimental-strip-types features/theme/services/themeResolver.test.mjs
```

Expected: PASS.

- [ ] **Step 2: Run existing focused tests**

Run the lightweight tests already present in the repo:

```powershell
node --experimental-strip-types constants/safeArea.test.mjs
node --experimental-strip-types features/auth/services/authMappers.test.mjs
node --experimental-strip-types features/auth/services/sessionRouting.test.mjs
node --experimental-strip-types features/profile/services/profileMappers.test.mjs
node --experimental-strip-types features/user/services/userUploadValidation.test.mjs
node --experimental-strip-types features/user/services/userDocumentQuery.test.mjs
node --experimental-strip-types features/user/services/userDocumentMappers.test.mjs
node --experimental-strip-types features/user/services/userBackendUploadMappers.test.mjs
node --experimental-strip-types features/admin/services/adminMappers.test.mjs
```

Expected: PASS. `MODULE_TYPELESS_PACKAGE_JSON` warning is acceptable.

- [ ] **Step 3: Run TypeScript**

Run:

```powershell
npx tsc --noEmit
```

Expected: PASS. If unrelated pre-existing errors remain, capture the first error and confirm whether any theme-touched file is listed.

- [ ] **Step 4: Run lint**

Run:

```powershell
npm run lint
```

Expected: PASS. If lint fails, fix theme-touched files first and document unrelated failures separately.

- [ ] **Step 5: Manual smoke test**

Run:

```powershell
npm run start -- --clear
```

Manual flow:

1. Login page renders in light mode.
2. Go to profile and switch `Giao diện` to `Tối`.
3. Kill and restart the app. Theme preference remains `Tối`.
4. Navigate through student tabs: `Trang chủ`, `Thư viện`, `Tài liệu của tôi`, `Đóng góp`, `Hồ sơ`.
5. Navigate through moderator tabs: `Trang chủ`, `Duyệt tài liệu`, `Hồ sơ`.
6. Navigate through admin tabs: `Trang chủ`, `Người dùng`, `Môn học`, `Hồ sơ`.
7. Open modals in user creation, subject creation/edit, document rejection, and profile edit.
8. Confirm no white card, black text, invisible icon, or washed-out disabled state remains in dark mode.
9. Switch profile theme to `Sáng` and confirm all changed screens return to light surfaces.
10. Switch profile theme to `Theo hệ thống` and confirm system theme is respected.

- [ ] **Step 6: Final status check**

Run:

```powershell
git status --short
```

Expected: theme files are the only new intentional files for this slice. Unrelated dirty files from admin/moderator real API work may remain, but they must be called out before staging or committing.

