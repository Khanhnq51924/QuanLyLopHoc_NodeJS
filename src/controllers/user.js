import User from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const dangKy = async (req, res) => {
  try {
    const { name, email, password, studentId, className } = req.body;

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
      studentId: role === "Student" ? studentId : undefined,
      className: role === "Student" ? className : undefined,
    });

    user.password = undefined;

    return res.status(201).json({
      message: `Đăng ký thành công với vai trò ${role}`,
      user,
    });
  } catch (error) {
    return res.status(400).json({
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

    if (req.user._id.toString() === id) {
      return res.status(400).json({ message: "Không thể tự xóa chính mình" });
    }

    const userToDelete = await User.findById(id);
    if (!userToDelete) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    if (!["Teacher", "Student"].includes(userToDelete.role)) {
      return res.status(400).json({ message: "Chỉ được xóa Teacher hoặc Student" });
    }
    userToDelete.daXoa = true;
    userToDelete.active = false;
    await userToDelete.save();

    return res.status(200).json({ message: "Xóa người dùng thành công (xóa mềm)" });
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

export const dangKyGiaoVien = async (req, res) => {
  try {
    const { name, email, password, avata, image, content } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      avata,
      image,
      content,
      role: undefined, // mặc định
      status: "cho",
    });

    user.password = undefined;
    return res.status(201).json({
      message: "Đăng ký giáo viên thành công. Chờ xác nhận từ Admin.",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Đăng ký giáo viên thất bại",
      error: error.message,
    });
  }
};

export const getDanhSachDangKyGV = async (req, res) => {
  try {
    const users = await User.find({ 
        role: "Teacher",
      status: { $in: ["cho", "xac_nhan", "tu_choi"] }, 
      daXoa: { $ne: true }
    }).select("-password");

    return res.status(200).json({
      message: "Lấy danh sách đăng ký giáo viên thành công",
      users,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi khi lấy danh sách đăng ký giáo viên",
      error: error.message,
    });
  }
};

export const duyetDangKyGV = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const user = await User.findById(id);
    if (!user || user.daXoa) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    if (status === "xac_nhan") {
      user.role = "Teacher";
      user.status = "xac_nhan";
    } else if (status === "tu_choi") {
      user.role = undefined;
      user.status = "tu_choi";
    } else {
      return res.status(400).json({ message: "Trạng thái không hợp lệ" });
    }

    await user.save();
    return res.status(200).json({
      message: `Đã cập nhật trạng thái: ${status}`,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi khi duyệt đăng ký giáo viên",
      error: error.message,
    });
  }
};
export const khoiPhucTaiKhoanTuChoi = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("+daXoa");
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    if (user.status !== "tu_choi" || user.daXoa !== true) {
      return res.status(400).json({ message: "Tài khoản này không ở trạng thái bị từ chối hoặc chưa bị xóa" });
    }

    user.daXoa = false;
    user.status = "cho";
    user.role = undefined;

    await user.save();
    return res.status(200).json({ message: "Khôi phục tài khoản thành công", user });

  } catch (error) {
    return res.status(500).json({
      message: "Khôi phục tài khoản thất bại",
      error: error.message,
    });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('+active');

    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    let profile = {
      name: user.name,
      email: user.email,
      role: user.role,
    };

    if (user.role === 'Admin') {
      profile = {
        ...profile,
        createdAt: user.createdAt,
        active: user.active,
      };
    }

    if (user.role === 'Teacher') {
      // Tìm các lớp mà teacher đang dạy = các assignment có teacherId là userId
      const assignments = await Assignment.find({ teacherId: userId });
      const classNames = [...new Set(assignments.map(a => a.className))]; // loại bỏ trùng lặp

      profile = {
        ...profile,
        teachingClasses: classNames,
        totalClasses: classNames.length,
        teachingSince: user.createdAt,
      };
    }

    if (user.role === 'Student') {
      // Lấy các bài nộp của sinh viên
      const submissions = await Submission.find({ studentId: userId });

      const completed = submissions.filter(s => s.status === 'approved').length;
      const pending = submissions.filter(s => s.status === 'pending').length;
      const rejected = submissions.filter(s => s.status === 'rejected').length;

      // Lấy giáo viên từ các bài tập đã nộp
      const assignmentIds = submissions.map(s => s.assignmentId);
      const assignments = await Assignment.find({ _id: { $in: assignmentIds } }).populate('teacherId');

      const teachers = [...new Set(assignments.map(a => a.teacherId?.name).filter(Boolean))];

      profile = {
        ...profile,
        className: user.className,
        totalAssignments: submissions.length,
        completedAssignments: completed,
        pendingAssignments: pending,
        rejectedAssignments: rejected,
        teachers,
        studyingSince: user.createdAt,
      };
    }

    return res.json(profile);
  } catch (error) {
    console.error('Error getting profile:', error);
    return res.status(500).json({ message: 'Lỗi server' });
  }
};