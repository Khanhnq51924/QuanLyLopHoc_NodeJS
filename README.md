# QuanLyLopHoc_NodeJS

- Thêm file .env trước khi chạy code:
PORT=3000
MONGODB_URI=mongodb://localhost:27017/quanlylophoc
JWT_SECRET=mySecretKey



- thêm file .babelrc trước khi chạy code (nếu chưa có):
{
    "presets": ["@babel/preset-env"]
}   

- chạy pnpm i joi + npm i bcryptjs trước khi chạy dev

- ae để ý phần middleware gồm:
+ requireRole để phân quyền cho người dùng, đã viết sẵn hàm:
router nào ae muốn phần quyền chỉ việc thêm requireRole("role người đó") (xem tham khảo ở router/user.js)
+ authenticate để xác thực xem đăng nhập chưa thì với được dùng các chức năng cần token
cái này cho all vào router các chức năng ae code đc ( xem tham khảo ở router/user.js)

