import Class from '../models/class.js';

// Tạo lớp học mới
export const createClass = async (req, res) => {
  try {
    const newClass = new Class(req.body);
    await newClass.save();
    res.status(201).json(newClass);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Gán giáo viên cho lớp học
export const assignTeacher = async (req, res) => {
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

// Lấy danh sách tất cả lớp học (chưa bị xóa)
export const getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find({ daXoa: false }).populate('teacher', 'name email');
    res.json(classes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Cập nhật thông tin lớp học
export const updateClass = async (req, res) => {
  try {
    const updated = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Xóa lớp học
export const deleteClass = async (req, res) => {
  try {
    const updated = await Class.findByIdAndUpdate(
      req.params.id,
      { daXoa: true },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Lớp học không tồn tại" });
    }

    res.json({ message: "Đã xóa lớp học (mềm) thành công", class: updated });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
// Khôi phục lớp học bị xóa mềm
export const restoreClass = async (req, res) => {
  try {
    const restored = await Class.findByIdAndUpdate(
      req.params.id,
      { daXoa: false },
      { new: true }
    );

    if (!restored) {
      return res.status(404).json({ message: "Không tìm thấy lớp học để khôi phục" });
    }

    res.json({ message: "Khôi phục lớp học thành công", class: restored });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


