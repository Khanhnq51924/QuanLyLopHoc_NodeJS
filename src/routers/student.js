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
import { checkXoa } from '../middleware/checkXoa';
const routerStudent = express.Router();

// Admin tạo sinh viên
routerStudent.post('/', authenticate, requireRole('Admin'), validateRequest(studentRegisterSchema), createStudent);
// Lấy danh sách sinh viên (Admin, Teacher)
routerStudent.get('/', authenticate, requireRole('Admin', 'Teacher'),checkXoa, getAllStudents);
// Lấy chi tiết sinh viên (Admin, Teacher)
routerStudent.get('/:id', authenticate, requireRole('Admin', 'Teacher'),checkXoa, getStudentDetail);
// Admin cập nhật sinh viên
routerStudent.patch('/:id', authenticate, requireRole('Admin'), validateRequest(studentUpdateSchema), updateStudent);
// Admin xóa sinh viên
routerStudent.delete('/:id', authenticate, requireRole('Admin'), deleteStudent);
// Lấy sinh viên theo lớp (Admin, Teacher)
routerStudent.get('/class/:className', authenticate, requireRole('Admin', 'Teacher'),checkXoa, getStudentsByClass);

export default routerStudent; 