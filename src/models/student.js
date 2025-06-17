import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tên không được để trống'],
    trim: true,
    minlength: [2, 'Tên phải có ít nhất 2 ký tự'],
    maxlength: [100, 'Tên không được vượt quá 100 ký tự']
  },
  studentId: {
    type: String,
    required: [true, 'MSSV không được để trống'],
    unique: true,
    trim: true,
    maxlength: [20, 'MSSV không được vượt quá 20 ký tự']
  },
  className: {
    type: String,
    required: [true, 'Lớp không được để trống'],
    trim: true,
    maxlength: [50, 'Lớp không được vượt quá 50 ký tự']
  },
  email: {
    type: String,
    required: [true, 'Email không được để trống'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/(\S+@\S+\.\S+)/, 'Email không hợp lệ']
  },
  active: {
    type: Boolean,
    default: true,
    select: true,
  },
  daXoa: {
  type: Boolean,
  default: false,
  select: false,
},

}, {
  timestamps: true
});

const Student = mongoose.model('Student', studentSchema);
export default Student; 