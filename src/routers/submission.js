import express from 'express';
import { authenticate, requireRole } from '../middleware/requireRole';
import { validateRequest } from '../middleware/validateRequest';
import { submissionSchema, submissionUpdateSchema, gradeSubmissionSchema, commentSchema } from '../validation/submission';
import {
  createSubmission,
  getAllSubmissions,
  getSubmissionDetail,
  updateSubmission,
  deleteSubmission,
  getSubmissionsByStudent,
  getSubmissionsByAssignment,
  gradeSubmission,
  getAssignmentStatus,
  addComment,
  restoreSubmission
} from '../controllers/submission';
import { checkXoa } from '../middleware/checkXoa';

const routerSubmission = express.Router();

// Tạo bài nộp mới (hoc sinh)
routerSubmission.post('/', authenticate, requireRole('Student'), validateRequest(submissionSchema), createSubmission);

// Lấy danh sách bài nộp (admin/giao vien/hoc sinh)
routerSubmission.get('/', authenticate, requireRole('Admin', 'Teacher', 'Student'),checkXoa, getAllSubmissions);

// Lấy chi tiết bài nộp (admin/giao vien/hoc sinh)
routerSubmission.get('/:id', authenticate, requireRole('Admin', 'Teacher', 'Student'),checkXoa, getSubmissionDetail);

// Cập nhật bài nộp (admin/giao vien/hoc sinh)
routerSubmission.patch('/:id', authenticate, requireRole('Admin', 'Teacher', 'Student'),checkXoa, validateRequest(submissionUpdateSchema), updateSubmission);

// Đánh giá bài nộp (giao vien)
routerSubmission.post('/:id/grade', authenticate, requireRole('Teacher'),checkXoa, validateRequest(gradeSubmissionSchema), gradeSubmission);

// Thêm comment cho bài nộp (giao vien)
routerSubmission.post('/:id/comment', authenticate, requireRole('Teacher'),checkXoa, validateRequest(commentSchema), addComment);

// Xóa bài nộp (admin/giao vienn)
routerSubmission.delete('/:id', authenticate, requireRole('Admin', 'Teacher'),checkXoa, deleteSubmission);

// Lấy bài nộp theo sinh viên (admin/giao vien/hoc sinh)
routerSubmission.get('/student/:studentId', authenticate, requireRole('Admin', 'Teacher', 'Student'),checkXoa, getSubmissionsByStudent);

// Lấy bài nộp theo bài tập (admin/giao vien)
routerSubmission.get('/assignment/:assignmentId', authenticate, requireRole('Admin', 'Teacher'),checkXoa, getSubmissionsByAssignment);

// Lấy trạng thái bài nộp của tất cả sinh viên cho một bài tập (admin/giao vien)
routerSubmission.get('/assignment/:assignmentId/status', authenticate, requireRole('Admin', 'Teacher'),checkXoa, getAssignmentStatus);
routerSubmission.patch('/:id/restore', authenticate, requireRole('Admin', 'Teacher'), checkXoa, restoreSubmission);
export default routerSubmission; 