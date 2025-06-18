import Class from "../models/class";
import Student from "../models/student";
import User from "../models/user";
import mongoose from 'mongoose';

// Tạo sinh viên
export const assignStudentToClass = async (req, res) => {
  try {
    const { studentId } = req.params; // Đây là _id của User
    const { classId } = req.body;

    // Kiểm tra id hợp lệ
    if (!mongoose.Types.ObjectId.isValid(studentId) || !mongoose.Types.ObjectId.isValid(classId)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }

    // Tìm User có role Student
    const user = await User.findOne({ _id: studentId, role: "Student" });
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy sinh viên hoặc người dùng không phải sinh viên" });
    }

    // Tìm lớp học
    const classInfo = await Class.findOne({ _id: classId, daXoa: false });
    if (!classInfo) {
      return res.status(404).json({ message: "Không tìm thấy lớp học" });
    }

    // Gán tên lớp
    user.className = classInfo.className;
    await user.save();

    user.password = undefined; // ẩn mật khẩu nếu có

    return res.status(200).json({
      message: "Gán sinh viên vào lớp thành công",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Gán sinh viên vào lớp thất bại",
      error: error.message,
    });
  }
};
// Lấy danh sách sinh viên (lọc theo tên, MSSV, lớp nếu có query)
export const getAllStudents = async (req, res) => {
  try {
    const { name, studentId, className } = req.query;
    let filter = { role: "Student" }; // lọc đúng role

    if (name) filter.name = { $regex: name, $options: "i" };
    if (studentId) filter.studentId = studentId;
    if (className) filter.className = className;

    const students = await User.find(filter); 
    return res.status(200).json({ students });
  } catch (error) {
    return res.status(500).json({
      message: "Lấy danh sách sinh viên thất bại",
      error: error.message,
    });
  }
};

// Lấy chi tiết sinh viên
export const getStudentDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const student = await Student.findById(id);
        if (!student) return res.status(404).json({ message: "Không tìm thấy sinh viên" });
        return res.status(200).json({ student });
    } catch (error) {
        return res.status(500).json({ message: "Lấy chi tiết sinh viên thất bại", error: error.message });
    }
};

// Cập nhật sinh viên
export const updateStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, studentId, className, email } = req.body;
        const student = await Student.findByIdAndUpdate(
            id,
            { name, studentId, className, email },
            { new: true, runValidators: true }
        );
        if (!student) return res.status(404).json({ message: "Không tìm thấy sinh viên" });
        return res.status(200).json({ message: "Cập nhật sinh viên thành công", student });
    } catch (error) {
        return res.status(500).json({ message: "Cập nhật sinh viên thất bại", error: error.message });
    }
};

// Xóa sinh viên
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findByIdAndUpdate(
      id,
      { daXoa: true },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ message: "Không tìm thấy sinh viên" });
    }

    return res.status(200).json({ message: "Xóa mềm sinh viên thành công" });
  } catch (error) {
    return res.status(500).json({
      message: "Xóa mềm sinh viên thất bại",
      error: error.message,
    });
  }
};


// Lấy danh sách sinh viên theo lớp
export const getStudentsByClass = async (req, res) => {
    try {
        const { className } = req.params;
        const students = await Student.find({ className });
        return res.status(200).json({ students });
    } catch (error) {
        return res.status(500).json({ message: "Lấy danh sách sinh viên theo lớp thất bại", error: error.message });
    }
}; 