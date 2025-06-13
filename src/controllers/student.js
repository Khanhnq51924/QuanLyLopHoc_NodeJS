import Student from "../models/student";

// Tạo sinh viên
export const createStudent = async (req, res) => {
    try {
        const { name, studentId, className, email } = req.body;
        const existing = await Student.findOne({ $or: [{ studentId }, { email }] });
        if (existing) {
            return res.status(400).json({ message: "Email hoặc MSSV đã tồn tại" });
        }
        const student = await Student.create({ name, studentId, className, email });
        return res.status(201).json({ message: "Tạo sinh viên thành công", student });
    } catch (error) {
        return res.status(500).json({ message: "Tạo sinh viên thất bại", error: error.message });
    }
};

// Lấy danh sách sinh viên (lọc theo tên, MSSV, lớp nếu có query)
export const getAllStudents = async (req, res) => {
    try {
        const { name, studentId, className } = req.query;
        let filter = {};
        if (name) filter.name = { $regex: name, $options: "i" };
        if (studentId) filter.studentId = studentId;
        if (className) filter.className = className;
        const students = await Student.find(filter);
        return res.status(200).json({ students });
    } catch (error) {
        return res.status(500).json({ message: "Lấy danh sách sinh viên thất bại", error: error.message });
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
        const student = await Student.findByIdAndDelete(id);
        if (!student) return res.status(404).json({ message: "Không tìm thấy sinh viên" });
        return res.status(200).json({ message: "Xóa sinh viên thành công" });
    } catch (error) {
        return res.status(500).json({ message: "Xóa sinh viên thất bại", error: error.message });
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