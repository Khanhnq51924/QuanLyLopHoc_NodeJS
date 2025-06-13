import Joi from 'joi';

export const studentRegisterSchema = Joi.object({
  name: Joi.string().required().max(100).messages({
    'string.base': 'Tên phải là chuỗi',
    'string.empty': 'Tên không được để trống',
    'string.max': 'Tên không được vượt quá {#limit} ký tự',
    'any.required': 'Tên là bắt buộc',
  }),
  studentId: Joi.string().required().max(20).messages({
    'string.base': 'MSSV phải là chuỗi',
    'string.empty': 'MSSV không được để trống',
    'string.max': 'MSSV không được vượt quá {#limit} ký tự',
    'any.required': 'MSSV là bắt buộc',
  }),
  className: Joi.string().required().max(50).messages({
    'string.base': 'Lớp phải là chuỗi',
    'string.empty': 'Lớp không được để trống',
    'string.max': 'Lớp không được vượt quá {#limit} ký tự',
    'any.required': 'Lớp là bắt buộc',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Email không hợp lệ',
    'string.empty': 'Email không được để trống',
    'any.required': 'Email là bắt buộc',
  })
});

export const studentUpdateSchema = Joi.object({
  name: Joi.string().max(100),
  studentId: Joi.string().max(20),
  className: Joi.string().max(50),
  email: Joi.string().email(),
}); 