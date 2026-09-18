# AGENTS.md

## Canonical governance bắt buộc

Trước mọi thay đổi mã nguồn, dữ liệu, kiến trúc hoặc hạ tầng, AI/Agent phải đọc và tuân thủ `00_AI_WORKING_CONSTITUTION_VINH_BAO.md`.

- Constitution là baseline nguyên tắc dùng chung cho hệ sinh thái Vĩnh Bảo.
- `AGENTS.md` chỉ bổ sung hướng dẫn thực thi riêng của repository; không được tạo bộ nguyên tắc cạnh tranh.
- Khi có thay đổi Constitution, đồng bộ theo version qua Issue → branch → PR.
- Nếu có mâu thuẫn, ưu tiên pháp luật/quy định có thẩm quyền, sau đó là chỉ đạo mới hơn và cụ thể hơn của người dùng trong phạm vi hợp lệ.

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


## Chỉ đạo riêng cho nhiệm vụ portfolio TTHC — 11/09/2026

Người dùng đã ủy quyền tự động merge toàn bộ phần việc hoàn tất từ đầu nhiệm vụ và các phần hoàn tất tiếp theo, không cần hỏi lại. Trong nhiệm vụ portfolio này, chỉ đạo này thay thế yêu cầu dừng/chờ người dùng review trước merge ở trên. Quy trình: Issue → branch → test → PR → agent review diff và kiểm tra CI tại head hiện tại → merge có kiểm tra head → kiểm chứng sau merge. PR Draft, kiểm thử lỗi hoặc dữ liệu chưa đủ căn cứ chưa được coi là hoàn tất. Không bỏ qua branch protection, quyền nền tảng, bảo vệ secret/PII hoặc tự suy đoán dữ liệu pháp lý. Ngoài nhiệm vụ này, quy trình mặc định vẫn áp dụng.
