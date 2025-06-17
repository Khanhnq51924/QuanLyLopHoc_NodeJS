const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// Middleware xác thực token
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: 'Bạn chưa đăng nhập hoặc token không hợp lệ' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Gắn thông tin người dùng vào req để sử dụng tiếp
    next();
  } catch (error) {
    res.status(403).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
  }
};

// Middleware kiểm tra quyền là admin hoặc giáo viên
exports.isAdminOrTeacher = (req, res, next) => {
  const { role } = req.user;
  if (role === 'admin' || role === 'teacher') {
    next();
  } else {
    return res.status(403).json({ message: 'Bạn không có quyền truy cập chức năng này' });
  }
};

// Middleware kiểm tra quyền là admin
exports.isAdmin = (req, res, next) => {
  const { role } = req.user;
  if (role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Chỉ admin mới được phép thực hiện hành động này' });
  }
};
