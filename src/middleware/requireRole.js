import User from "../models/user";
import jwt from "jsonwebtoken";

// kiểm tra token có đủ để truy cập vào các chức năng hay không
export const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Bạn không có quyền truy cập" });
        }
        next();
    };
};

// hàm này kiểm tra token
export const authenticate = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Chưa đăng nhập" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) return res.status(401).json({ message: "Không tìm thấy người dùng" });
        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Token không hợp lệ" });
    }
};