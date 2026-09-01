# Sổ tay điện tử hướng dẫn thủ tục hành chính

Sản phẩm hỗ trợ người dân và doanh nghiệp tra cứu thủ tục hành chính thuộc phạm vi quan tâm của Trung tâm Phục vụ hành chính công xã Vĩnh Bảo, thành phố Hải Phòng.

## Phạm vi

Website chỉ cung cấp thông tin hướng dẫn và liên kết đến hệ thống chính thức. Website không:

- đăng nhập hoặc tích hợp tài khoản VNeID;
- tiếp nhận hồ sơ, giấy tờ hoặc dữ liệu cá nhân;
- thanh toán phí, lệ phí;
- theo dõi trạng thái giải quyết hồ sơ;
- thay thế thông tin công bố của cơ quan có thẩm quyền.

## Chức năng

- Tìm kiếm tiếng Việt có dấu hoặc không dấu theo tên, mã và từ khóa.
- Lọc theo nhóm lĩnh vực, lĩnh vực và mức độ trực tuyến.
- Hiển thị nội dung hướng dẫn, mở PDF nguồn và dẫn sang Cổng Dịch vụ công.
- Tạo liên kết trực tiếp tới từng thủ tục bằng tham số `?tthc=MÃ-THỦ-TỤC`.
- Hỗ trợ tăng/giảm cỡ chữ, tương phản cao, bàn phím và in nội dung hướng dẫn.
- Giao diện đáp ứng cho máy tính, máy tính bảng và điện thoại.

## Cấu trúc dữ liệu

Danh mục thủ tục được quản lý tại `data/procedures.json`. Mỗi bản ghi sử dụng các trường chính:

| Trường | Ý nghĩa |
|---|---|
| `id` | Số thứ tự duy nhất |
| `code` | Mã thủ tục hành chính |
| `name` | Tên thủ tục |
| `field` | Lĩnh vực |
| `group` | Nhóm lĩnh vực |
| `level` | Mức độ trực tuyến |
| `pdf` | Đường dẫn PDF hướng dẫn trong repository |
| `online` | Liên kết tra cứu/nộp hồ sơ trên hệ thống chính thức |
| `search` | Từ khóa hỗ trợ tìm kiếm |
| `detail` | Trình tự, hồ sơ, cách thức thực hiện và căn cứ trong tài liệu nguồn |

Danh sách PDF thực có được ghi tại `data/pdf-manifest.json`. Giao diện chỉ tạo nút mở PDF khi đường dẫn đồng thời xuất hiện trong danh sách này, nhờ đó không phát sinh liên kết tải tài liệu bị hỏng.

## Nguyên tắc cập nhật nội dung

1. Chỉ cập nhật từ quyết định công bố TTHC, Cổng Dịch vụ công hoặc nguồn chính thức có thể kiểm chứng.
2. Không suy đoán thành phần hồ sơ, thời hạn, phí, thẩm quyền hoặc căn cứ pháp lý.
3. Kiểm tra đồng thời dữ liệu hiển thị, PDF hướng dẫn và liên kết Cổng Dịch vụ công.
4. Nếu nội dung chưa xác minh, không đưa ra như thông tin đang có hiệu lực.
5. Kiểm tra tìm kiếm, bộ lọc, liên kết PDF và hiển thị trên điện thoại trước khi xuất bản.

## Chạy thử tại máy tính

```bash
python -m http.server 8000
```

Sau đó mở `http://localhost:8000`. Không mở trực tiếp `index.html` bằng giao thức `file://` vì trình duyệt có thể chặn việc tải tệp JSON.
