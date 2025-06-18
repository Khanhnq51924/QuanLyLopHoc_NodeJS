import Assignment from '../models/assignment';

// Tạo bài tập mới
export const createAssignment = async (req, res) => {
  try {
    const { title, description, classId, deadline, fileUrl } = req.body;
    const createdBy = req.user._id;

    const assignment = await Assignment.create({
      title,
      description,
      classId,
      deadline,
      fileUrl,
      createdBy
    });

    return res.status(201).json({ message: 'Tạo bài tập thành công', assignment });
  } catch (error) {
    return res.status(500).json({ message: 'Tạo bài tập thất bại', error: error.message });
  }
};

// Lấy danh sách bài tập
export const getAllAssignments = async (req, res) => {
  try {
    const { classId, includeDeleted = false } = req.query;
    const filter = {};

    if (classId) filter.classId = classId;
    if (includeDeleted !== 'true') filter.daXoa = false;

    const assignments = await Assignment.find(filter)
      .populate('classId', 'name')
      .populate('createdBy', 'name email');

    return res.status(200).json({ assignments });
  } catch (error) {
    return res.status(500).json({ message: 'Lấy danh sách bài tập thất bại', error: error.message });
  }
};

// Lấy chi tiết bài tập
export const getAssignmentDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const assignment = await Assignment.findById(id)
      .populate('classId', 'name')
      .populate('createdBy', 'name email');

    if (!assignment || assignment.daXoa)
      return res.status(404).json({ message: 'Không tìm thấy bài tập' });

    return res.status(200).json({ assignment });
  } catch (error) {
    return res.status(500).json({ message: 'Lấy chi tiết bài tập thất bại', error: error.message });
  }
};

// Cập nhật bài tập
export const updateAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, deadline, fileUrl, active } = req.body;

    const assignment = await Assignment.findOneAndUpdate(
      { _id: id, daXoa: false },
      { title, description, deadline, fileUrl, active },
      { new: true, runValidators: true }
    );

    if (!assignment)
      return res.status(404).json({ message: 'Không tìm thấy bài tập' });

    return res.status(200).json({ message: 'Cập nhật bài tập thành công', assignment });
  } catch (error) {
    return res.status(500).json({ message: 'Cập nhật bài tập thất bại', error: error.message });
  }
};

// Xóa mềm bài tập
export const softDeleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;

    const assignment = await Assignment.findOneAndUpdate(
      { _id: id, daXoa: false },
      { daXoa: true },
      { new: true }
    );

    if (!assignment)
      return res.status(404).json({ message: 'Không tìm thấy bài tập để xóa' });

    return res.status(200).json({ message: 'Xoá bài tập thành công (mềm)', assignment });
  } catch (error) {
    return res.status(500).json({ message: 'Xoá bài tập thất bại', error: error.message });
  }
};

// Khôi phục bài tập đã xóa mềm
export const restoreAssignment = async (req, res) => {
  try {
    const { id } = req.params;

    const assignment = await Assignment.findOneAndUpdate(
      { _id: id, daXoa: true },
      { daXoa: false },
      { new: true }
    );

    if (!assignment)
      return res.status(404).json({ message: 'Không tìm thấy bài tập đã xoá' });

    return res.status(200).json({ message: 'Khôi phục bài tập thành công', assignment });
  } catch (error) {
    return res.status(500).json({ message: 'Khôi phục bài tập thất bại', error: error.message });
  }
};

// Lấy tất cả bài tập của một lớp học
export const getAssignmentsByClass = async (req, res) => {
  try {
    const { classId } = req.params;

    if (!classId) {
      return res.status(400).json({ message: 'Thiếu classId trong yêu cầu' });
    }

    const assignments = await Assignment.find({ classId, daXoa: false })
      .populate('createdBy', 'name email')
      .sort({ deadline: 1 }); // Sắp xếp theo deadline tăng dần (nếu muốn)

    return res.status(200).json({ assignments });
  } catch (error) {
    return res.status(500).json({
      message: 'Lấy bài tập theo lớp học thất bại',
      error: error.message,
    });
  }
};

