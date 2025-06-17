
import User from "../models/user";

export const checkNotDeleted = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("daXoa");

    if (!user || user.daXoa) {
      return res.status(403).json({
        message: "Tài khoản đã bị vô hiệu hóa hoặc xóa.",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi kiểm tra trạng thái tài khoản",
      error: error.message,
    });
  }
};
