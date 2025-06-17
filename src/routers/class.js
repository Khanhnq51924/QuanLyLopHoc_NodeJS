import express from 'express';
import {
  createClass,
  assignTeacher,
  getAllClasses,
  updateClass,
  deleteClass,
  restoreClass
} from '../controllers/class.js';
import { authenticate, requireRole } from '../middleware/requireRole.js';
import { checkXoa } from '../middleware/checkXoa.js';

const routerClass = express.Router();

// Admin mới được phép tạo, sửa, xóa lớp học
routerClass.post('/', authenticate, checkXoa, requireRole("Admin"), createClass);
routerClass.put('/:id/assign-teacher', authenticate, checkXoa, requireRole("Admin"), assignTeacher);
routerClass.put('/:id', authenticate, checkXoa, requireRole("Admin"), updateClass);
routerClass.delete('/:id', authenticate, checkXoa, requireRole("Admin"), deleteClass);
// Khôi phục lớp học
routerClass.patch('/restore/:id',authenticate,checkXoa,requireRole('Admin', 'Teacher'),restoreClass);

// Tất cả người dùng đã đăng nhập đều có thể xem danh sách lớp
routerClass.get('/', authenticate, checkXoa, getAllClasses);

export default routerClass;
