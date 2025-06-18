import express from 'express';
import { authenticate, requireRole } from '../middleware/requireRole';
import { checkXoa } from '../middleware/checkXoa';
import { createAssignment, getAllAssignments, getAssignmentDetail, getAssignmentsByClass, restoreAssignment, softDeleteAssignment, updateAssignment } from '../controllers/assignment';


const routerASM = express.Router();

// Tạo bài tập (chỉ giáo viên/admin)
routerASM.post(
  '/',
  authenticate,
  checkXoa,
  requireRole('Teacher', 'Admin'),
  createAssignment
);

// Lấy tất cả bài tập (ai cũng được xem nếu đã đăng nhập)
routerASM.get(
  '/',
  authenticate,
  checkXoa,
  getAllAssignments
);

// Lấy chi tiết bài tập
routerASM.get(
  '/:id',
  authenticate,
  checkXoa,
  getAssignmentDetail
);

// Cập nhật bài tập (chỉ giáo viên/admin)
routerASM.put(
  '/:id',
  authenticate,
  checkXoa,
  requireRole('Teacher', 'Admin'),
  updateAssignment
);

// Xóa mềm bài tập
routerASM.delete(
  '/:id',
  authenticate,
  checkXoa,
  requireRole('Teacher', 'Admin'),
  softDeleteAssignment
);

// Khôi phục bài tập
routerASM.patch(
  '/restore/:id',
  authenticate,
  checkXoa,
  requireRole('Teacher', 'Admin'),
  restoreAssignment
);
routerASM.get('/:classId',authenticate,
  checkXoa,
  requireRole('Teacher', 'Admin', 'Student'), getAssignmentsByClass);
export default routerASM;
