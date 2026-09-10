# Quy trình làm việc GitHub bắt buộc

Áp dụng cho mọi thay đổi do người dùng, cộng tác viên, Codex hoặc AI/agent thực hiện trên repository này.

## Quy trình bắt buộc

1. **Tạo Issue** mô tả mục tiêu, phạm vi, tiêu chí hoàn thành và ràng buộc.
2. **Tạo branch riêng** từ `main`; không sửa trực tiếp `main`.
3. **Thực hiện thay đổi trên branch** và giữ phạm vi đúng Issue.
4. **Chạy test/kiểm tra phù hợp**; phải ghi rõ lệnh hoặc cách kiểm tra và kết quả.
5. **Tạo Pull Request** liên kết Issue, mô tả file đã thay đổi, test đã chạy, rủi ro và phần cần kiểm tra.
6. **Không merge** cho đến khi Hồng Diễn kiểm tra và chấp thuận rõ ràng.

## Quy tắc an toàn

- Không tự merge, bật auto-merge hoặc bypass review.
- Không force-push vào `main`.
- Không đưa secret, mật khẩu, token, cookie, dữ liệu cá nhân hoặc dữ liệu nghiệp vụ nhạy cảm vào repository.
- Nếu test không thể chạy, PR phải ghi rõ lý do và trạng thái `NEED_REVIEW`; không coi là hoàn thành.
- Nếu yêu cầu mới vượt phạm vi Issue, tạo Issue mới hoặc chờ chỉ đạo; không tự mở rộng phạm vi.

## Chuẩn đặt tên branch

- `feature/<issue>-<mo-ta>`
- `fix/<issue>-<mo-ta>`
- `chore/<issue>-<mo-ta>`

## Điều kiện trước khi đề nghị merge

- Issue đã được liên kết.
- Thay đổi chỉ nằm trong phạm vi Issue.
- Test/kiểm tra phù hợp đã chạy và có kết quả.
- Không phát hiện secret/PII ngoài phạm vi cho phép.
- PR đã sẵn sàng để Hồng Diễn kiểm tra.
