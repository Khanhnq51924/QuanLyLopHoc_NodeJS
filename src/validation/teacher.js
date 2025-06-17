import Joi from "joi";

export const registerTeacherSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      "string.empty": "Tên không được để trống",
      "string.min": "Tên phải có ít nhất 2 ký tự",
      "string.max": "Tên không được vượt quá 100 ký tự",
    }),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "Email không được để trống",
      "string.email": "Email không hợp lệ",
    }),

  password: Joi.string()
    .min(6)
    .required()
    .messages({
      "string.empty": "Mật khẩu không được để trống",
      "string.min": "Mật khẩu phải có ít nhất 6 ký tự",
    }),

  avata: Joi.string()
    .uri()
    .optional()
    .allow(null, "")
    .messages({
      "string.uri": "Link ảnh đại diện không hợp lệ",
    }),

  image: Joi.string()
    .uri()
    .optional()
    .allow(null, "")
    .messages({
      "string.uri": "Link hình ảnh không hợp lệ",
    }),

  content: Joi.string()
    .max(1000)
    .optional()
    .allow(null, "")
    .messages({
      "string.max": "Nội dung giới thiệu không được vượt quá 1000 ký tự",
    }),
});
