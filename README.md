# Sổ tay điện tử TTHC xã Vĩnh Bảo

Giao diện sổ tay hai trang, tìm kiếm tiếng Việt không dấu, phân nhóm lĩnh vực, đọc hướng dẫn và mở PDF. Điện thoại có mục lục riêng và vuốt chuyển trang; thiết bị bật giảm chuyển động sẽ bỏ hoạt ảnh.

Kho quản lý: https://github.com/hongdienvbhp/sotaydientuTTHC

## Chạy và kiểm tra

Chạy một HTTP server tại thư mục này (ví dụ `python -m http.server 4173 --bind 127.0.0.1`), sau đó mở http://127.0.0.1:4173/.

```sh
node --check app.js
node --check reader.js
node --test tools/sync-congkhai.test.mjs
```

## Cập nhật từ dữ liệu dự án CongkhaiTTHC

Hỗ trợ file `data/imports/vinhbao-master-data-*.json` với format `bangniemyet-vinhbao-master-data` và bản export `CongkhaiTTHC-backup` (các bảng nằm trong `data`). Không cần website CongkhaiTTHC đang chạy.

```sh
node tools/sync-congkhai.mjs /duong-dan/du-lieu-du-an.json .staging/lan-cap-nhat-moi
```

Đầu ra: `report.json` và `procedures.candidate.json`. Thư mục đích phải mới. Công cụ không ghi đè dữ liệu đang phục vụ và không gửi lên GitHub.

- Bản backup: chỉ chọn `publication_status=published` và `effect_status=effective`.
- Master dự án: chỉ tạo bản chờ duyệt từ dòng có dấu vết xác minh được hỗ trợ; không suy diễn đã publish production.
- Đối chiếu theo mã; giữ ID đã có; không ghép PDF cũ vào nội dung mới.
- Thiếu phí, thời hạn, cơ quan quyết định hoặc thành phần hồ sơ: giữ trống; không tự bổ sung.
- Bản ghi trùng/thiếu mã hoặc tên: báo lỗi và không tạo ứng viên. Danh sách mất khỏi nguồn chỉ để rà soát, không tự xóa.
- Chỉ lấy trường nghiệp vụ cần thiết; không sao chép tài khoản, nhật ký hoặc dữ liệu cán bộ từ backup.

Sau khi người phụ trách duyệt báo cáo, đưa thay đổi vào nhánh riêng và Pull Request. Chỉ thay `data/procedures.json` và công bố sau xác nhận. Không commit `.staging`, bản backup thô hoặc secret. GitHub Actions chỉ kiểm tra mã, không tự công khai dữ liệu.

## Phạm vi nghiệp vụ

Trung tâm hướng dẫn, tiếp nhận, kiểm tra thành phần/tính đầy đủ và hợp lệ ở khâu tiếp nhận, số hóa, chuyển hồ sơ, theo dõi, đôn đốc và trả kết quả. Cơ quan chuyên môn/người có thẩm quyền thẩm định nội dung, quyết định và ký kết quả. Danh mục hiện có là dữ liệu nguồn, không phải kết luận kiểm tra hiệu lực pháp lý tại thời điểm người dân tra cứu.
