# Nghiên cứu trang mẫu và ứng dụng — 07/09/2026

Nguồn quan sát: https://sotaydientuhuongdantthc.hanoi.gov.vn/

## Bằng chứng quan sát

Trang bìa có nền xanh, nhận diện cơ quan ở đầu, tên sổ tay lớn, ảnh phục vụ người dân, minh họa điện thoại và kênh hỗ trợ ở chân trang. Bộ đọc hiển thị 66 trang; có mũi tên lật, mục lục hình thu nhỏ, phóng to, âm thanh, chia sẻ, về đầu/cuối, tự chạy và toàn màn hình.

Trang mục lục phân tầng: lợi ích dịch vụ công → cổng quốc gia → Trung tâm/điểm phục vụ → VNeID → nhóm nhu cầu công dân/doanh nghiệp. Đây là cách tổ chức dễ tiếp cận, nhưng ánh xạ thủ tục vào nhu cầu cần danh mục đã kiểm tra; không tự gán theo từ khóa.

DOM công khai cho thấy các tài nguyên `jquery-3.5.1.min.js`, `book.min.js`, `main.min.js`, `BookPreview.js`, `pdf.js`, config trang và cấu hình text/SVG. Các trang quan sát chủ yếu xuất hiện dưới dạng ảnh trong cây trợ năng. Đây là bằng chứng về lớp trình duyệt; chưa xác định framework máy chủ, thuật toán lật trang, giấy phép thư viện hay mã nguồn gốc. Truy xuất riêng mã JS không thành công; không khẳng định đã nghiên cứu nội bộ thư viện hoặc sao chép code của trang mẫu.

## Áp dụng vào dự án

Giữ hình thức quyển sổ, màu xanh và nhận diện Vĩnh Bảo có sẵn. Nội dung thủ tục dùng HTML để tìm kiếm, đọc bằng công cụ trợ năng và cập nhật theo mã. Thêm chuyển trang 3D bằng Web Animations API; đây là hiệu ứng xoay trang, chưa phải mô phỏng uốn cong giấy/kéo góc như một số bộ flipbook.

Khắc phục lỗi ẩn 6 thủ tục không có PDF; tính số lượng từ dữ liệu thay vì ghi cố định. Điện thoại có nút mở mục lục/tìm kiếm; văn bản tăng kích thước và vùng danh sách cuộn được. Không lật trang bằng phím mũi tên khi đang nhập tìm kiếm; có hỗ trợ giảm chuyển động.

## Dữ liệu liên thông

Đã kiểm tra README, API `/api/procedures`, hàm ánh xạ dữ liệu và API backup của kho `hongdienvbhp/CongkhaiTTHC`. API danh sách chỉ trả tóm tắt; chưa có endpoint chi tiết công khai trong danh sách API kiểm tra. Theo yêu cầu người dùng, tích hợp dùng file dữ liệu dự án qua ChatCode, không phụ thuộc URL production.

Đã đọc master ngày 07/09 từ project `congkhaitthc-final`: 193 dòng. Snapshot tự báo 13 thủ tục bãi bỏ và 2 thủ tục hiệu lực tương lai đã bị loại trước khi tạo master. Các số này là thông tin của snapshot, chưa phải kiểm tra pháp lý độc lập trong lần này. File chi tiết ứng viên chưa đọc được vì connector trả lỗi; bản chuyển đổi hiện tại chỉ có các trường master thực sự cung cấp.

Mã nguồn sổ tay quản lý ở kho công khai đã có. Không tạo kho trùng; chuẩn bị nhánh/PR, kiểm tra rồi xin xác nhận trước khi gửi theo AGENTS.md của người dùng. Dữ liệu nháp và báo cáo staging không đưa lên kho công khai.

## Đối chiếu bản GitHub

HEAD đã tải: `06a1f7c` (đã có lật trang, mục lục mobile và manifest PDF). Thư mục làm việc ban đầu cũ hơn HEAD. Bản chuẩn bị giữ nội dung giới thiệu mới và tài nguyên QR/VNeID từ HEAD, giữ nguyên JSON thủ tục và manifest trên kho; cải tiến lại hiệu ứng và khả năng tiếp cận. Chỉ thư mục làm việc có đủ 45 đường dẫn PDF; số PDF trên bản GitHub phải tính theo manifest riêng, không hứa có đủ 45 tệp trên website công khai.

Bản chuyển đổi master: 193 dòng hợp lệ về cấu trúc; 14 mã có trong danh mục 51 mã, 179 mã mới, 37 mã cũ không xuất hiện. Đây là đối chiếu mã, không phải kết luận bãi bỏ 37 thủ tục. Bản xem trước chỉ chạy tại localhost với `?preview=congkhai`, không được nạp ở hostname công khai.
