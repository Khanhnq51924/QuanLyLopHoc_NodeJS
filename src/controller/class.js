const Class = require('../models/class');

// Tạo lớp học mới
exports.createClass = async (req, res) => {
  try {
    const newClass = new Class(req.body);
    await newClass.save();
    res.status(201).json(newClass);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Gán giáo viên cho lớp học
exports.assignTeacher = async (req, res) => {
  try {
    const updatedClass = await Class.findByIdAndUpdate(
      req.params.id,
      { teacher: req.body.teacherId },
      { new: true }
    ).populate('teacher');
    res.json(updatedClass);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Lấy danh sách tất cả lớp học
exports.getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find().populate('teacher', 'name email');
    res.json(classes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Cập nhật thông tin lớp học
exports.updateClass = async (req, res) => {
  try {
    const updated = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Xóa lớp học
exports.deleteClass = async (req, res) => {
  try {
    await Class.findByIdAndDelete(req.params.id);
    res.json({ message: 'Class deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
