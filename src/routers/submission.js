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
  addComment
} from '../controllers/submission';

const router = express.Router();

// Tạo bài nộp mới (hoc sinh)
router.post('/', authenticate, requireRole('Student'), validateRequest(submissionSchema), createSubmission);

// Lấy danh sách bài nộp (admin/giao vien/hoc sinh)
router.get('/', authenticate, requireRole('Admin', 'Teacher', 'Student'), getAllSubmissions);

// Lấy chi tiết bài nộp (admin/giao vien/hoc sinh)
router.get('/:id', authenticate, requireRole('Admin', 'Teacher', 'Student'), getSubmissionDetail);

// Cập nhật bài nộp (admin/giao vien/hoc sinh)
router.patch('/:id', authenticate, requireRole('Admin', 'Teacher', 'Student'), validateRequest(submissionUpdateSchema), updateSubmission);

// Đánh giá bài nộp (giao vien)
router.post('/:id/grade', authenticate, requireRole('Teacher'), validateRequest(gradeSubmissionSchema), gradeSubmission);

// Thêm comment cho bài nộp (giao vien)
router.post('/:id/comment', authenticate, requireRole('Teacher'), validateRequest(commentSchema), addComment);

// Xóa bài nộp (admin/giao vienn)
router.delete('/:id', authenticate, requireRole('Admin', 'Teacher'), deleteSubmission);

// Lấy bài nộp theo sinh viên (admin/giao vien/hoc sinh)
router.get('/student/:studentId', authenticate, requireRole('Admin', 'Teacher', 'Student'), getSubmissionsByStudent);

// Lấy bài nộp theo bài tập (admin/giao vien)
router.get('/assignment/:assignmentId', authenticate, requireRole('Admin', 'Teacher'), getSubmissionsByAssignment);

// Lấy trạng thái bài nộp của tất cả sinh viên cho một bài tập (admin/giao vien)
router.get('/assignment/:assignmentId/status', authenticate, requireRole('Admin', 'Teacher'), getAssignmentStatus);

export default router; 