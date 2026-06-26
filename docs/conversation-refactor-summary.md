# Conversation Refactor Summary

## Mục tiêu ban đầu

Người dùng yêu cầu refactor source code FE `ai-study-hub-mobile` với phạm vi:

- Không refactor giao diện.
- Chỉ refactor cách gọi API, caching, data handling và performance app.
- Dùng React Query cho dữ liệu từ server.
- Giữ `useState` hoặc Zustand cho dữ liệu phát sinh từ user như click, type, toggle, modal, filter, form.
- Tách fetch data khỏi component giao diện.
- Tạo hoặc gom custom hooks dùng chung như `useAuth`, `usePagination`, `useDebounce`.
- Thêm Error Boundary để tránh app trắng toàn trang khi một vùng nhỏ crash.
- Giữ Service/Repository layer cho API endpoint.
- Chuẩn hóa pattern loading / error / empty / success.
- Trước khi code phải có plan để người dùng đọc và duyệt.

## Quyết định triển khai

Sau khi khảo sát project, có 3 hướng được đề xuất:

1. Refactor toàn bộ một lượt.
2. Refactor theo feature.
3. Chỉ áp dụng React Query cho màn mới.

Người dùng chọn hướng 2: refactor theo feature.

Nguyên tắc áp dụng trong toàn bộ refactor:

- Data từ server dùng React Query.
- Data từ user dùng `useState` hoặc Zustand.
- Component/screen không gọi API trực tiếp.
- API call nằm ở service layer, React Query hook gọi service.
- Không thay đổi layout hay style UI.
- Giữ API trả về của hook gần giống trước đó để giảm rủi ro cho screen.

## Hạ tầng đã refactor

### React Query core

Đã thêm:

- `services/api/queryClient.ts`
- `services/api/queryKeys.ts`
- `services/api/queryState.ts`

Nội dung chính:

- Tạo `QueryClient` dùng chung.
- Cấu hình cache mặc định: `staleTime`, `gcTime`, retry nhẹ cho lỗi server/network.
- Cấu hình React Native focus/online manager bằng `AppState` và `@react-native-community/netinfo`.
- Tạo query key factory cho các domain:
  - `profileKeys`
  - `userSubjectKeys`
  - `userDocumentKeys`
  - `documentKeys`
  - `moderatorDocumentKeys`
  - `adminKeys`
- Tạo helper `getQueryErrorMessage`.
- Tạo helper `getAsyncUiState` cho 4 trạng thái `loading / error / empty / success`.

### Root layout

Đã cập nhật:

- `app/_layout.tsx`

Thay đổi:

- Bọc app bằng `QueryClientProvider`.
- Gọi `configureQueryManagers`.
- Bọc navigation bằng `ErrorBoundary`.
- Không đổi navigation stack, routes hay UI.

### Error Boundary

Đã thêm:

- `components/error-boundary.tsx`

Mục tiêu:

- Nếu một vùng UI crash, app có fallback thay vì trắng toàn trang.
- Có nút thử lại để reset boundary state.

### Shared hooks

Đã thêm:

- `hooks/useDebounce.ts`
- `hooks/usePagination.ts`

Mục tiêu:

- Dùng `useDebounce` cho query search/filter có liên quan server.
- Dùng `usePagination` cho pagination local do user điều khiển.

## Feature đã refactor

### Auth

Đã thêm:

- `features/auth/hooks/useAuth.ts`
- `features/auth/hooks/useLogin.ts`

Đã cập nhật:

- `features/auth/hooks/useLogout.ts`
- `features/auth/index.ts`
- `features/auth/screens/LoginScreen.tsx`
- `features/auth/screens/RegisterScreen.tsx`

Thay đổi chính:

- `authStore` vẫn giữ session/token/role/user snapshot vì đây là global session state.
- Login chuyển sang `useLogin` mutation.
- Sau login, hook lưu token vào `authStore` và seed profile vào React Query cache bằng `queryClient.setQueryData(profileKeys.detail(), profile)`.
- Logout chuyển sang mutation, gọi API logout rồi clear query cache và auth store.
- `RegisterScreen` hiện vẫn là flow thông báo đang tích hợp, không có server mutation thật.

### Profile

Đã cập nhật:

- `features/profile/hooks/useProfile.ts`
- `features/profile/hooks/useProfileDocuments.ts`
- `features/profile/index.ts`
- `features/profile/types.ts`
- `features/profile/screens/MyDocumentScreen.tsx`
- `features/profile/components/DocumentItem.tsx`

Đã xóa:

- `features/profile/store/profileStore.ts`

Thay đổi chính:

- Profile server data không còn nằm trong Zustand.
- `useProfile` dùng `useQuery` để fetch `/auth/me`.
- `saveProfile` dùng `useMutation` để update profile.
- Khi profile query/mutation thành công, auth store được sync lại role/user snapshot.
- `clearProfile` giờ remove query cache thay vì clear Zustand store.
- Route `/my-documents` trong profile không còn dùng local empty array.
- `MyDocumentScreen` dùng `useProfileDocuments`, hook này tái sử dụng `useMyDocuments` của React Query và map sang type UI cũ.
- Delete ở màn profile legacy này vẫn là UI state tạm thời, chỉ ẩn item local như behavior cũ. Flow student documents chính đã dùng API delete ở `UserMyDocumentsScreen`.
- Màn này có đủ loading / error / empty / success state và pull-to-refresh.

### User feature

Đã thêm:

- `features/user/hooks/useUserSubjects.ts`
- `features/user/hooks/useDeleteUserDocument.ts`

Đã cập nhật:

- `features/user/hooks/useUserDocuments.ts`
- `features/user/hooks/useUserUploadDocument.ts`
- `features/user/index.ts`
- `features/user/screens/UserLibraryScreen.tsx`
- `features/user/screens/UserMyDocumentsScreen.tsx`
- `features/user/services/userDocumentService.ts`
- `features/user/services/userUploadService.ts`

Thay đổi chính:

- `useRecentDocuments`, `useLibraryDocuments`, `useMyDocuments` chuyển sang `useQuery`.
- Hook vẫn trả về `documents`, `pagination`, `isLoading`, `error`, `refresh` để screen ít đổi.
- Subject list chuyển sang `useUserSubjects`.
- `UserLibraryScreen` không còn tự gọi `fetchUserSubjects`; search/filter vẫn là local UI state.
- Upload document dùng `useMutation`.
- Upload success invalidate toàn bộ `userDocumentKeys.all`.
- Delete document trong `UserMyDocumentsScreen` dùng `useDeleteUserDocument` mutation.
- Delete gọi `DELETE /documents/:id`, sau đó invalidate `userDocumentKeys.all`, `documentKeys.detail(id)`, `moderatorDocumentKeys.all`.
- File picker, form values, validation error, submit error vẫn dùng `useState` vì là user/UI state.

### Document / Moderator feature

Đã cập nhật:

- `features/document/hooks/useDocumentDetail.ts`
- `features/document/hooks/useEditDocument.ts`
- `features/document/hooks/useModeratorDocuments.ts`
- `features/document/hooks/useModeratorDocumentDetail.ts`
- `features/document/services/documentService.ts`
- `features/document/screens/EditDocumentScreen.tsx`
- `features/document/screens/ModeratorDashboardScreen.tsx`
- `app/document/[id]/edit.tsx`

Thay đổi chính:

- Document detail dùng `useQuery`.
- Document edit route dùng `useDocumentDetail` để prefill form từ server.
- `EditDocumentScreen` bỏ mock timeout, nhận loading/error/saving/deleting từ hook/container.
- Update document dùng `PATCH /documents/:id` qua `useEditDocument` mutation.
- Delete document dùng `DELETE /documents/:id` qua `useEditDocument` mutation.
- Sau update/delete invalidate `documentKeys.detail`, `userDocumentKeys.all`, `moderatorDocumentKeys.all`.
- Form input, category modal, alert confirm delete vẫn là UI/user state.
- Moderator dashboard dùng `useQuery`.
- Moderator document list dùng `useInfiniteQuery` cho load more.
- Approve/reject dùng `useMutation`.
- Sau approve/reject invalidate:
  - moderator document queries
  - document detail query liên quan
- `ModeratorDashboardScreen` đọc profile qua `useProfile` thay vì profile store.
- Modal state, reject reason, selected document vẫn dùng `useState`.

### Admin feature

Đã thêm:

- `features/admin/hooks/useAdminQueries.ts`

Đã cập nhật:

- `features/admin/index.ts`
- `features/admin/screens/DashboardScreen.tsx`
- `features/admin/screens/UsersScreen.tsx`
- `features/admin/screens/SubjectsScreen.tsx`

Thay đổi chính:

- `DashboardScreen` không còn tự gọi `fetchAdminDashboardStats` hoặc `fetchAdminAccounts`.
- `UsersScreen` không còn tự gọi `fetchAdminAccounts`, `fetchAdminAccountDetail`, `createAdminAccount`, `banAdminAccount`.
- `SubjectsScreen` không còn tự gọi `fetchAdminSubjects`, `fetchAdminSubjectDetail`, `createAdminSubject`, `updateAdminSubject`, `deleteAdminSubject`.
- Query hooks/mutation hooks mới:
  - `useAdminDashboard`
  - `useAdminAccounts`
  - `useAdminAccountDetail`
  - `useCreateAdminAccount`
  - `useBanAdminAccount`
  - `useAdminSubjects`
  - `useAdminSubjectDetail`
  - `useSaveAdminSubject`
  - `useDeleteAdminSubject`
- Search/filter/modal/form draft vẫn giữ `useState`.
- Subject search dùng `useDebounce`.
- Subject pagination dùng `usePagination`.
- Mutations invalidate `adminKeys.all`.

## File test đã xóa theo yêu cầu sau đó

Người dùng yêu cầu xóa toàn bộ file test đuôi `.mjs` hoặc `.js` không ảnh hưởng runtime.

Đã xóa các file test sau:

- `constants/safeArea.test.mjs`
- `features/profile/services/profileMappers.test.mjs`
- `features/theme/services/themeResolver.test.mjs`
- `features/user/services/userBackendUploadMappers.test.mjs`
- `features/user/services/userDocumentMappers.test.mjs`
- `features/user/services/userDocumentQuery.test.mjs`
- `features/user/services/userUploadValidation.test.mjs`
- `services/api/queryKeys.test.mjs`
- `services/api/queryState.test.mjs`

Không xóa các file `.js` cấu hình như `eslint.config.js`.

## Feature hoặc phần chưa refactor

Các phần dưới đây chưa refactor hoặc giữ nguyên có chủ đích vì không thuộc phạm vi server-data refactor, chưa có API thật, hoặc là UI/local state:

### UI layout và style

Không refactor giao diện theo đúng yêu cầu ban đầu.

Giữ nguyên:

- Layout màn hình.
- Component tree ở mức UI.
- StyleSheet, theme colors, spacing.
- Text hiển thị.
- Navigation stack.

### Theme feature

Giữ nguyên:

- `features/theme/store/themeStore.ts`
- `features/theme/hooks/useAppTheme.ts`
- `features/theme/services/themeResolver.ts`

Lý do:

- Theme preference là user preference/local state.
- Theo rule, data từ user hoặc preference global hợp lý với Zustand.

### Public feature

Giữ nguyên:

- `features/public/screens/PublicHomeScreen.tsx`

Lý do:

- Không có server data.
- Chỉ xử lý redirect dựa trên auth store và route hiện tại.

### Auth route guards

Giữ nguyên phần lớn:

- `features/auth/components/RoleGate.tsx`
- `app/moderator-review.tsx`
- Các tab layout route guard.

Lý do:

- Đây là navigation/session logic, không phải server data fetching.
- Vẫn dựa vào `authStore` cho session/role.

### Document home legacy state

Chưa refactor:

- `features/document/screens/DocumentHomeScreen.tsx`
- `features/document/hooks/useDocument.ts`
- `features/document/store/documentStore.ts`

Lý do:

- Hiện dùng store local cho `searchQuery`, `quickPrompts`, `trendingDocuments`, `recommendedCourses`.
- Không thấy API thật được gọi từ phần này trong flow hiện tại.
- Nếu sau này các dữ liệu trending/recommended/quick prompts đến từ server, nên chuyển các field đó sang React Query.
- `searchQuery` vẫn có thể giữ Zustand/useState vì là user input.

### Legacy document upload screen

Chưa refactor:

- `features/document/screens/UploadScreen.tsx`
- `features/document/hooks/useUploadDocument.ts`

Lý do:

- Route upload hiện tại đang dùng `features/user/screens/UserContributeScreen.tsx`.
- `features/document/hooks/useUploadDocument.ts` vẫn có TODO và mock timeout.
- Không nên nối API vào màn legacy nếu chưa xác nhận màn này còn dùng.

### Document bookmark/download placeholder actions

Chưa refactor toàn bộ:

- Một số action placeholder trong `app/document/[id].tsx`

Lý do:

- Bookmark/download vẫn đang là placeholder.
- Chưa thấy endpoint bookmark/download riêng trong backend hiện tại.
- Nên refactor sau khi xác nhận API hoặc cách download chính thức trên mobile.

### Package files

`package.json` và `package-lock.json` đã có thay đổi trước khi bắt đầu refactor:

- Có diff liên quan `react-native-svg`.
- Refactor React Query không phụ thuộc vào thay đổi này vì `@tanstack/react-query` đã có sẵn trong dependencies.

## Verification đã chạy trong conversation

Trước refactor:

- `npm run lint` pass.
- `npx tsc --noEmit` pass.

Sau refactor React Query:

- `npm run lint` pass.
- `npx tsc --noEmit` pass.
- Node test suite lúc đó pass 24 tests trước khi người dùng yêu cầu xóa test files.

Sau khi xóa test files:

- Kiểm tra không còn file `*.test.mjs`, `*.test.js`, `*.spec.mjs`, `*.spec.js`.
- `npm run lint` pass.
- `npx tsc --noEmit` pass.

Sau khi refactor tiếp profile `/my-documents`, document edit/delete và user document delete:

- `npm run lint` pass.
- `npx tsc --noEmit` pass.

## Trạng thái tổng kết

Đã hoàn thành refactor theo feature cho các khu vực có server data chính:

- React Query infrastructure.
- Auth login/logout mutation flow.
- Profile query/mutation.
- User documents/subjects/upload mutation.
- User document delete mutation.
- Document detail.
- Moderator dashboard/list/detail approve/reject.
- Admin dashboard/users/subjects.
- Profile `/my-documents` route.
- Document edit/delete route.

Chưa refactor các phần local/legacy/placeholder:

- Theme preference.
- Public landing/redirect.
- Route guards.
- Document home store nếu chưa có API thật.
- Document bookmark/download placeholder flows.

Khuyến nghị tiếp theo:

1. Nếu `DocumentHomeScreen` có endpoint trending/recommended, chuyển store data sang React Query.
2. Nếu `DocumentHomeScreen` còn được dùng thật, thay store data bằng React Query hoặc route sang `UserHomeScreen`.
3. Nếu bookmark/download có API, thêm mutation hooks và invalidation theo `documentKeys`.

## Sprint refactor bổ sung (2026-06-27)

### `app/modal.tsx` — Refactor ban mutation

Đã cập nhật:

- `app/modal.tsx`

Thay đổi:

- Xóa `useState(params.status)` và local toggle.
- Dùng `useAdminAccountDetail(params.id)` để lấy status thật từ server.
- Dùng `useBanAdminAccount` mutation để gọi `PATCH /accounts/:id/ban`.
- Hiển thị loading spinner khi đang fetch.
- Nút ban chỉ xuất hiện khi `canBan === true` (giống logic trong `UsersScreen`).
- Sau khi ban thành công, navigate back để force reload data.
- Không đổi layout, style.

### `features/document/hooks/useUploadDocument.ts` — Nối API thật

Đã cập nhật:

- `features/document/hooks/useUploadDocument.ts`

Thay đổi:

- Xóa `useState<UploadStatus>` riêng.
- Thêm `useMutation` gọi `uploadUserDocument` (reuse service từ `features/user/services/userUploadService.ts`).
- `uploadStatus` được derive từ mutation state: `isPending` → "uploading", `isSuccess` → "success", `isError` → "error".
- Xóa `TODO: replace with real API call` và mock `setTimeout(1500)`.
- Sau upload thành công invalidate `userDocumentKeys.all`.
- Giữ nguyên interface return để `UploadScreen` không cần đổi.

### Verification

- `npx tsc --noEmit` pass.
- `npm run lint` pass.
