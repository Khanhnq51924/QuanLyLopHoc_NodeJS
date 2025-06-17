import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Tiêu đề không được để trống'],
    trim: true,
    maxlength: [200, 'Tiêu đề không được vượt quá 200 ký tự']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [2000, 'Mô tả không được vượt quá 2000 ký tự']
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: [true, 'Lớp không được để trống']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // giáo viên tạo bài tập
    required: true
  },
  deadline: {
    type: Date,
    required: [true, 'Hạn nộp không được để trống']
  },
  fileUrl: {
    type: String,
    trim: true
  },
  active: {
    type: Boolean,
    default: true
  },
  daXoa: {
    type: Boolean,
    default: false,
    select: false
  }
}, {
  timestamps: true
});

const Assignment = mongoose.model('Assignment', assignmentSchema);
export default Assignment;
