# AGENTS.md

## GitHub workflow bắt buộc

Mọi Codex/AI/agent làm việc trong repository này phải tuân thủ:

**Tạo Issue → tạo branch riêng → thực hiện thay đổi → chạy test/kiểm tra → tạo Pull Request → DỪNG trước merge.**

Không được:
- sửa trực tiếp `main`;
- tự merge hoặc bật auto-merge;
- bỏ qua test mà không báo;
- mở rộng phạm vi ngoài Issue;
- ghi secret, credential, cookie, token hoặc dữ liệu cá nhân nhạy cảm vào repo.

Khi hoàn thành, báo cáo tối thiểu:
1. Issue;
2. branch;
3. file đã tạo/sửa;
4. test/kiểm tra đã chạy;
5. pass/fail;
6. PR;
7. rủi ro hoặc nội dung cần người dùng kiểm tra.

Chỉ merge khi có chấp thuận rõ ràng của Hồng Diễn.
