import Joi from 'joi';

export const submissionSchema = Joi.object({
  studentId: Joi.string().required().messages({
    'string.base': 'Mã sinh viên phải là chuỗi',
    'string.empty': 'Mã sinh viên không được để trống',
    'any.required': 'Mã sinh viên là bắt buộc',
  }),
  assignmentId: Joi.string().required().messages({
    'string.base': 'Mã bài tập phải là chuỗi',
    'string.empty': 'Mã bài tập không được để trống',
    'any.required': 'Mã bài tập là bắt buộc',
  }),
  content: Joi.string().required().messages({
    'string.base': 'Nội dung bài nộp phải là chuỗi',
    'string.empty': 'Nội dung bài nộp không được để trống',
    'any.required': 'Nội dung bài nộp là bắt buộc',
  }),
  fileUrl: Joi.string().allow('').messages({
    'string.base': 'URL file phải là chuỗi',
  }),
  status: Joi.string().valid('pending', 'approved', 'rejected').default('pending').messages({
    'string.base': 'Trạng thái phải là chuỗi',
    'any.only': 'Trạng thái không hợp lệ',
  }),
  feedback: Joi.string().allow('').messages({
    'string.base': 'Phản hồi phải là chuỗi',
  }),
});

export const submissionUpdateSchema = Joi.object({
  content: Joi.string(),
  fileUrl: Joi.string().allow(''),
  status: Joi.string().valid('pending', 'approved', 'rejected'),
  feedback: Joi.string().allow(''),
});

// Schema ddeer đánh giá bài nộp
export const gradeSubmissionSchema = Joi.object({
  score: Joi.number().min(0).max(10).required().messages({
    'number.base': 'Điểm phải là số',
    'number.min': 'Điểm không được nhỏ hơn {#limit}',
    'number.max': 'Điểm không được lớn hơn {#limit}',
    'any.required': 'Điểm là bắt buộc',
  }),
  status: Joi.string().valid('approved', 'rejected').required().messages({
    'string.base': 'Trạng thái phải là chuỗi',
    'any.only': 'Trạng thái không hợp lệ',
    'any.required': 'Trạng thái là bắt buộc',
  }),
  feedback: Joi.string().allow('').messages({
    'string.base': 'Phản hồi phải là chuỗi',
  }),
  detailedFeedback: Joi.string().allow('').messages({
    'string.base': 'Nhận xét chi tiết phải là chuỗi',
  }),
});

// Schema cho thêm comment
export const commentSchema = Joi.object({
  comment: Joi.string().required().messages({
    'string.base': 'Comment phải là chuỗi',
    'string.empty': 'Comment không được để trống',
    'any.required': 'Comment là bắt buộc',
  })
}); 