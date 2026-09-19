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


## Chỉ đạo riêng cho nhiệm vụ portfolio TTHC — 11/09/2026

Người dùng đã ủy quyền tự động merge toàn bộ phần việc hoàn tất từ đầu nhiệm vụ và các phần hoàn tất tiếp theo, không cần hỏi lại. Trong nhiệm vụ portfolio này, chỉ đạo này thay thế yêu cầu dừng/chờ người dùng review trước merge ở trên. Quy trình: Issue → branch → test → PR → agent review diff và kiểm tra CI tại head hiện tại → merge có kiểm tra head → kiểm chứng sau merge. PR Draft, kiểm thử lỗi hoặc dữ liệu chưa đủ căn cứ chưa được coi là hoàn tất. Không bỏ qua branch protection, quyền nền tảng, bảo vệ secret/PII hoặc tự suy đoán dữ liệu pháp lý. Ngoài nhiệm vụ này, quy trình mặc định vẫn áp dụng.


## Làm việc đa máy / Codex / ChatCode — tự động bắt buộc

Mỗi phiên Codex, ChatGPT Web qua Codex Web GPT hoặc ChatCode khi bắt đầu làm việc trong repo này phải tự động chạy `scripts/ai-safe-start.ps1` (Windows) trước khi sửa code.

Agent phải:
- tự nhận diện máy hiện tại, repo, branch và upstream;
- tự `git fetch origin --prune`;
- nếu working tree sạch và chỉ behind upstream thì tự `git pull --ff-only`;
- nếu dirty/diverged thì bảo toàn thay đổi, không reset/clean/force;
- dùng branch theo Issue/task, không tạo branch theo tên máy;
- trước khi chuyển sang máy/executor khác, tự kiểm tra secret, checkpoint commit, push branch và cập nhật Issue/PR với NEXT_SAFE_ACTION;
- khi nhận lại việc ở máy khác, tự fetch/pull và xác minh HEAD trước khi tiếp tục;
- coi GitHub + Issue/PR/Linear là nguồn trạng thái, không dùng lịch sử chat hoặc máy local làm canonical source.

Người dùng không phải tự chạy các thao tác Git thông thường trên nếu agent có quyền thực hiện. Chỉ hỏi người dùng khi cần quyền/xác nhận bắt buộc hoặc có xung đột nghiệp vụ không thể tự quyết an toàn.
