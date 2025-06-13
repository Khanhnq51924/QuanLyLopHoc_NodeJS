import express from 'express';
import { authenticate, requireRole } from '../middleware/requireRole';
import { validateRequest } from '../middleware/validateRequest';
import { studentRegisterSchema, studentUpdateSchema } from '../validation/student';
import {
  createStudent,
  getAllStudents,
  getStudentDetail,
  updateStudent,
  deleteStudent,
  getStudentsByClass
} from '../controllers/student';

const router = express.Router();

// Admin tạo sinh viên
router.post('/', authenticate, requireRole('Admin'), validateRequest(studentRegisterSchema), createStudent);
// Lấy danh sách sinh viên (Admin, Teacher)
router.get('/', authenticate, requireRole('Admin', 'Teacher'), getAllStudents);
// Lấy chi tiết sinh viên (Admin, Teacher)
router.get('/:id', authenticate, requireRole('Admin', 'Teacher'), getStudentDetail);
// Admin cập nhật sinh viên
router.patch('/:id', authenticate, requireRole('Admin'), validateRequest(studentUpdateSchema), updateStudent);
// Admin xóa sinh viên
router.delete('/:id', authenticate, requireRole('Admin'), deleteStudent);
// Lấy sinh viên theo lớp (Admin, Teacher)
router.get('/class/:className', authenticate, requireRole('Admin', 'Teacher'), getStudentsByClass);

export default router; 