import User from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const dangKy = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email đã tồn tại" });
        }

        let role = "Student"; 
        if (email === "adminlophoc@gmail.com") {
            const AdminExists = await User.findOne({ role: "Admin" });
            if (!AdminExists) {
                role = "Admin"; 
            }
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ 
            name, 
            email, 
            password: hashedPassword, 
            role,
        });

        user.password = undefined;
        return res.status(201).json({
            message: `Đăng ký thành công với vai trò ${role}`,
            user,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Đăng ký thất bại",
            error: error.message,
        });
    }
};



export const dangNhap = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(400).json({ message: "Email hoặc mật khẩu không đúng" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Email hoặc mật khẩu không đúng" });
        }

        if (!user.active) {
            return res.status(403).json({ message: "Tài khoản đang bị khóa" });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        return res.status(200).json({
            message: "Đăng nhập thành công",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
        
    } catch (error) {
        return res.status(500).json({ message: "Đăng nhập thất bại", error: error.message });
    }
};

export const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (req.user._id.toString() === id) {
            return res.status(400).json({ message: "Không thể thay đổi quyền của chính mình" });
        }
        const validRoles = ["Admin", "Teacher", "Student"];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ message: "Vai trò không hợp lệ" });
        }

        const user = await User.findByIdAndUpdate(
            id,
            { role },
            { new: true, runValidators: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy người dùng" });
        }

        return res.status(200).json({
            message: "Cập nhật vai trò thành công",
            user,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Cập nhật vai trò thất bại",
            error: error.message,
        });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        return res.status(200).json({
            message: "Lấy danh sách người dùng thành công",
            users,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Lấy danh sách người dùng thất bại",
            error: error.message,
        });
    }
};
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Không cho phép tự xóa chính mình
        if (req.user._id.toString() === id) {
            return res.status(400).json({ message: "Không thể tự xóa chính mình" });
        }

        // Chỉ cho phép xóa Teacher hoặc Student
        const userToDelete = await User.findById(id);
        if (!userToDelete) {
            return res.status(404).json({ message: "Không tìm thấy người dùng" });
        }
        if (!["Teacher", "Student"].includes(userToDelete.role)) {
            return res.status(400).json({ message: "Chỉ được xóa Teacher hoặc Student" });
        }

        await User.findByIdAndDelete(id);

        return res.status(200).json({ message: "Xóa người dùng thành công" });
    } catch (error) {
        return res.status(500).json({
            message: "Xóa người dùng thất bại",
            error: error.message,
        });
    }
};

export const getUserDetail = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy người dùng" });
        }

        // Phân quyền xem chi tiết
        // Admin: xem tất cả
        // Teacher: xem chính mình hoặc student
        // Student: chỉ xem chính mình
        if (req.user.role === "Admin") {
            return res.status(200).json({ user });
        }
        if (req.user.role === "Teacher") {
            if (req.user._id.toString() === id || user.role === "Student") {
                return res.status(200).json({ user });
            }
            return res.status(403).json({ message: "Bạn không có quyền xem thông tin người dùng này" });
        }
        if (req.user.role === "Student") {
            if (req.user._id.toString() === id) {
                return res.status(200).json({ user });
            }
            return res.status(403).json({ message: "Bạn không có quyền xem thông tin người dùng này" });
        }
        return res.status(403).json({ message: "Bạn không có quyền xem thông tin người dùng này" });
    } catch (error) {
        return res.status(500).json({
            message: "Lấy chi tiết người dùng thất bại",
            error: error.message,
        });
    }
};