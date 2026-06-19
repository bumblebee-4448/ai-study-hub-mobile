# Moderator Mobile Real API Design

## Mục tiêu

Thay toàn bộ mock data và mock API trong trải nghiệm moderator của mobile app bằng API thật của backend hiện có. Giao diện moderator phải dùng tiếng Việt nhất quán, không hiển thị số liệu hoặc trường dữ liệu mà backend chưa cung cấp.

## Phạm vi

Trong phạm vi:

- Dashboard moderator trong `features/document/screens/ModeratorDashboardScreen.tsx`.
- Danh sách duyệt tài liệu trong `features/document/screens/ModeratorReviewScreen.tsx`.
- Chi tiết duyệt tài liệu trong `features/document/screens/ModeratorDocumentDetailScreen.tsx`.
- Route và tiêu đề tab liên quan trong `app/(moderator-tabs)/_layout.tsx` và `app/moderator-review.tsx`.
- Service, hook, mapper và test cần thiết để gọi API thật.

Ngoài phạm vi:

- Không sửa backend hoặc thêm endpoint analytics mới.
- Không giữ các số liệu mock như báo cáo vi phạm, biểu đồ tuần, tốc độ xử lý, AI trust score, số trang, năm xuất bản hoặc độ khẩn cấp.
- Không xây trình xem tài liệu trong app. Nếu có `fileUrl`, UI chỉ cung cấp hành động mở tệp bằng liên kết hệ thống.

## API backend sử dụng

Mobile app tiếp tục dùng `services/api/axiosClient.ts`, với base URL hiện tại từ `EXPO_PUBLIC_API_URL` hoặc fallback `http://10.0.2.2:8080/api/v1`.

Các endpoint dùng cho moderator:

- `GET /documents?status=PENDING&page=1&limit=N`: lấy tài liệu chờ duyệt.
- `GET /documents?status=ACTIVE&page=1&limit=N`: lấy tài liệu đã duyệt mà API hiện cho phép moderator nhìn thấy.
- `GET /documents?status=REJECTED&page=1&limit=N`: lấy tài liệu bị từ chối.
- `GET /documents/:id`: lấy chi tiết tài liệu.
- `POST /documents/:id/approve`: duyệt tài liệu.
- `POST /documents/:id/reject` với body `{ "rejectionReason": string }`: từ chối tài liệu.

Các số đếm trên dashboard lấy từ `pagination.total` của từng danh sách theo trạng thái. Đây là số liệu theo khả năng hiển thị của API hiện tại, không phải dashboard analytics riêng.

## Kiến trúc frontend

Giữ moderator trong feature `document` vì các màn hiện tại đã nằm ở đó và route app đang import từ feature này.

Các đơn vị mới hoặc được cập nhật:

- `features/document/services/moderatorDocumentService.ts`: gọi API danh sách, chi tiết, approve, reject.
- `features/document/services/moderatorDocumentMappers.ts`: map payload backend sang model UI ổn định cho moderator.
- `features/document/services/moderatorDocumentMappers.test.mjs`: test mapper bằng Node test runner, theo pattern đang có của app.
- `features/document/hooks/useModeratorDocuments.ts`: quản lý list theo status, loading, error, refresh và pagination cơ bản.
- `features/document/hooks/useModeratorDocumentDetail.ts`: quản lý chi tiết và action approve/reject cho một tài liệu.
- Các screen moderator chỉ đọc dữ liệu qua hook/service, không chứa mock arrays hoặc hard-coded counters.

Không tạo feature `moderator` mới trong vòng này để tránh migration route không cần thiết.

## Data mapping

Model UI của moderator chỉ chứa các trường backend đang có:

- `id`
- `title`
- `description`
- `status`
- `authorName`
- `subjectName`
- `format`
- `sizeInBytes`
- `fileUrl`
- `createdAt`
- `updatedAt`
- `rejectionReason`

Mapper chịu trách nhiệm:

- fallback tên tác giả thành `Không rõ tác giả` khi thiếu dữ liệu;
- fallback môn học thành `Chưa phân loại` khi thiếu dữ liệu;
- format kích thước tệp thành `KB`, `MB` hoặc `GB`;
- format ngày theo tiếng Việt bằng `vi-VN`;
- map status thành nhãn `Chờ duyệt`, `Đã duyệt`, `Từ chối`, `Đã xóa`.

Các trường không có trong backend sẽ bị xóa khỏi UI thay vì giả lập.

## Luồng màn hình

Dashboard:

- Hiển thị số lượng tài liệu `Chờ duyệt`, `Đã duyệt`, `Từ chối`.
- Hiển thị danh sách tác vụ gần đây từ tài liệu thật, ưu tiên tài liệu chờ duyệt.
- Có trạng thái loading, lỗi, retry và refresh.
- Không hiển thị card hoặc chart không có API thật.

Danh sách duyệt:

- Mặc định mở filter `Chờ duyệt`.
- Cho phép chuyển filter giữa `Chờ duyệt`, `Đã duyệt`, `Từ chối`.
- Dữ liệu lấy theo status thật từ `GET /documents`.
- Có loading, pull-to-refresh, empty state và retry.
- Mỗi item hiển thị title, tác giả, môn học, định dạng, dung lượng, ngày tạo và trạng thái.

Chi tiết tài liệu:

- Khi chọn item, màn chi tiết gọi `GET /documents/:id`.
- Hiển thị title, tác giả, môn học, mô tả, định dạng, dung lượng, ngày tạo, trạng thái và lý do từ chối nếu có.
- Nếu có `fileUrl`, hiển thị nút `Mở tệp`.
- Chỉ hiển thị action `Duyệt` và `Từ chối` khi tài liệu đang ở trạng thái `PENDING`.

Action duyệt/từ chối:

- `Duyệt` gọi `POST /documents/:id/approve`.
- `Từ chối` yêu cầu nhập lý do không rỗng rồi gọi `POST /documents/:id/reject`.
- Khi thành công, hiển thị thông báo tiếng Việt, refresh danh sách hiện tại và quay lại danh sách duyệt.
- Trong lúc submit, disable nút để tránh gửi trùng.

## Đồng bộ tiếng Việt

Thay các chuỗi tiếng Anh còn lại trong moderator flow:

- `Home` thành `Trang chủ`.
- `Document Review` thành `Duyệt tài liệu`.
- `Moderator` thành `Điều phối viên` hoặc `Kiểm duyệt viên` tùy ngữ cảnh màn.
- Các label như `AI Score`, `Accurate`, `Urgent`, `Review Queue` bị xóa hoặc đổi sang tiếng Việt nếu vẫn còn phù hợp với dữ liệu thật.

Thông báo lỗi dùng tiếng Việt ngắn gọn:

- `Không thể tải danh sách tài liệu.`
- `Không thể tải chi tiết tài liệu.`
- `Không thể duyệt tài liệu.`
- `Không thể từ chối tài liệu.`

## Kiểm thử

Áp dụng TDD cho phần mapper/service có logic mới:

- Test mapper map đúng tài liệu backend sang UI model.
- Test fallback tác giả, môn học, ngày và dung lượng.
- Test status label tiếng Việt.
- Test loại bỏ giả định về các trường mock không tồn tại.

Sau khi implement, chạy:

- `node --experimental-strip-types features/document/services/moderatorDocumentMappers.test.mjs`
- `npm run lint`
- `npx tsc --noEmit`

Nếu repo hiện có lỗi lint/type không liên quan, ghi rõ lỗi còn lại và bằng chứng command.

## Rủi ro và cách xử lý

- API chưa có endpoint dashboard analytics, nên dashboard chỉ dùng count theo trạng thái từ `/documents`.
- API `ACTIVE` có thể chỉ trả tài liệu public theo rule backend hiện tại. UI sẽ gọi đây là tài liệu `Đã duyệt` thay vì số liệu toàn hệ thống.
- Nếu backend thiếu `fileUrl`, nút mở tệp không xuất hiện.
- Nếu approve/reject trả về envelope khác nhau, service sẽ dựa vào `apiClient` hiện có để normalize response như các feature khác.
