# Todo Note Application

## Mô tả
Một website quản lý công việc trực tuyến được xây dựng theo mô hình MVC, cho phép người dùng tạo, sắp xếp, và quản lý các nhiệm vụ cá nhân. 
## Chức năng chính
- **Quản lý nhiệm vụ**: Cho phép thêm, sửa, xóa, xem chi tiết và đánh dấu hoàn thành nhiệm vụ. Cung cấp các chức năng tìm kiếm, phân trang và sắp xếp để dễ dàng truy cập và quản lý khi có nhiều nhiệm vụ.
- **Quản lý danh mục (Tag)**: Thống kê các nhiệm vụ theo từng danh mục, giúp phân loại các nhiệm vụ.
- **Lịch sử nhiệm vụ**: Có thể xem lại những nhiệm vụ đã hoàn thành.
- **Quản lý tài khoản**: Cho phép cập nhật thông tin cá nhân; thay đổi mật khẩu, ảnh đại diện.
- **Xác thực, Phân quyền**: Hỗ trợ đăng ký và đăng nhập tài khoản; bảo mật thông tin cá nhân, đảm bảo quyền truy cập hợp lệ vào các chức năng và dữ liệu của người dùng.
## Công nghệ sử dụng
- Ngôn ngữ lập trình JavaScript, Framework Express, MongoDBCompass.
- Frontend: Handlebars, Bootstrap.
## Cách sử dụng:
1. **Clone repository**: Lệnh này sao chép toàn bộ mã nguồn của dự án về máy tính của bạn từ GitHub.
         git clone https://github.com/quocviet2001/todo_note.git
2. **Cài đặt các phụ thuộc**: `npm install` sẽ cài đặt các thư viện cần thiết mà dự án của bạn sử dụng.
3. **Cấu hình `.env`**: Bạn cần tạo một tệp `.env` để cấu hình các thông số như kết nối đến cơ sở dữ liệu MongoDB và khóa bí mật cho session.
   
         git clone https://github.com/quocviet2001/todo_note.git
         
4. **Chạy ứng dụng**: `npm start` sẽ khởi động ứng dụng và `npm run watch` sẽ khởi động file css cho ứng dụng.
5. Truy cập ứng dụng qua trình duyệt tại http://localhost:3000.
