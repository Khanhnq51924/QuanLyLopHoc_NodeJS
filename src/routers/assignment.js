const express = require('express');
const router = express.Router();
const assignmentController = require('../controller/assignment');
const { verifyToken, isAdminOrTeacher } = require('../middlewares/auth');

// Tạo bài tập mới (chỉ admin hoặc giáo viên)
router.post('/', verifyToken, isAdminOrTeacher, assignmentController.createAssignment);

// Lấy danh sách bài tập theo lớp học
router.get('/:classId', verifyToken, assignmentController.getAssignmentsByClass);

// Cập nhật bài tập (chỉ admin hoặc giáo viên)
router.put('/:id', verifyToken, isAdminOrTeacher, assignmentController.updateAssignment);

// Xóa bài tập (chỉ admin hoặc giáo viên)
router.delete('/:id', verifyToken, isAdminOrTeacher, assignmentController.deleteAssignment);

module.exports = router;
