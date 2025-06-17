import Joi from "joi";

// Schema cho Signup
export const registerSchema = Joi.object({
  name: Joi.string().required().max(100).messages({
    "string.base": "Tên phải là chuỗi",
    "string.empty": "Tên không được để trống",
    "string.max": "Tên không được vượt quá {#limit} ký tự",
    "any.required": "Tên là bắt buộc",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Email không hợp lệ",
    "string.empty": "Email không được để trống",
    "any.required": "Email là bắt buộc",
  }),
  password: Joi.string().required().min(6).messages({
    "string.min": "Mật khẩu phải có ít nhất {#limit} ký tự",
    "string.empty": "Mật khẩu không được để trống",
    "any.required": "Mật khẩu là bắt buộc",
  }),

  studentId: Joi.string().optional().messages({
    "string.base": "Mã sinh viên phải là chuỗi"
  }),
  className: Joi.string().optional().messages({
    "string.base": "Tên lớp phải là chuỗi"
  }),

  role: Joi.forbidden().messages({
    "any.unknown": "Không được gửi role khi đăng ký",
  }),
});


// Schema cho Signin
export const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.email": "Email không hợp lệ",
        "string.empty": "Email không được để trống",
        "any.required": "Email là bắt buộc",
    }),
    password: Joi.string().required().messages({
        "string.empty": "Mật khẩu không được để trống",
        "any.required": "Mật khẩu là bắt buộc",
    }),
});

// Schema cho đăng ký sinh viên
export const studentRegisterSchema = Joi.object({
    name: Joi.string().required().max(100).messages({
        "string.base": "Tên phải là chuỗi",
        "string.empty": "Tên không được để trống",
        "string.max": "Tên không được vượt quá {#limit} ký tự",
        "any.required": "Tên là bắt buộc",
    }),
    email: Joi.string().email().required().messages({
        "string.email": "Email không hợp lệ",
        "string.empty": "Email không được để trống",
        "any.required": "Email là bắt buộc",
    }),
    password: Joi.string().required().min(6).messages({
        "string.min": "Mật khẩu phải có ít nhất {#limit} ký tự",
        "string.empty": "Mật khẩu không được để trống",
        "any.required": "Mật khẩu là bắt buộc",
    }),
    studentId: Joi.string().required().max(20).messages({
        "string.base": "MSSV phải là chuỗi",
        "string.empty": "MSSV không được để trống",
        "string.max": "MSSV không được vượt quá {#limit} ký tự",
        "any.required": "MSSV là bắt buộc",
    }),
    className: Joi.string().required().max(50).messages({
        "string.base": "Lớp phải là chuỗi",
        "string.empty": "Lớp không được để trống",
        "string.max": "Lớp không được vượt quá {#limit} ký tự",
        "any.required": "Lớp là bắt buộc",
    }),
    role: Joi.forbidden().messages({
        "any.unknown": "Không được gửi role khi đăng ký sinh viên",
    })
});

// Schema cho cập nhật sinh viên
export const studentUpdateSchema = Joi.object({
    name: Joi.string().max(100),
    email: Joi.string().email(),
    password: Joi.string().min(6),
    studentId: Joi.string().max(20),
    className: Joi.string().max(50),
});

export const registerTeacherSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  avata: Joi.string().uri().optional().allow(""),
  image: Joi.string().uri().optional().allow(""),
  content: Joi.string().max(1000).optional().allow(""),
});
