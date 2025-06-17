const Assignment = require('../models/assignment');

// Tạo mới bài tập
exports.createAssignment = async (req, res) => {
  try {
    const assignment = new Assignment(req.body);
    await assignment.save();
    res.status(201).json(assignment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Lấy tất cả bài tập theo lớp
exports.getAssignmentsByClass = async (req, res) => {
  try {
    const assignments = await Assignment.find({ classId: req.params.classId });
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Cập nhật thông tin bài tập
exports.updateAssignment = async (req, res) => {
  try {
    const updated = await Assignment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Xóa bài tập
exports.deleteAssignment = async (req, res) => {
  try {
    await Assignment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Assignment deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
