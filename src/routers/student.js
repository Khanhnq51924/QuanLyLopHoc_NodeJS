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
  getStudentsByClass,
  assignStudentToClass
} from '../controllers/student';
import { checkXoa } from '../middleware/checkXoa';
const routerStudent = express.Router();

routerStudent.put('/:studentId/assign-class', authenticate, requireRole('Admin'), assignStudentToClass);
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