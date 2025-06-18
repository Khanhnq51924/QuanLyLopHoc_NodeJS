import mongoose from 'mongoose';

const { Schema } = mongoose;

const classSchema = new Schema({
  className: {
    type: String,
    required: true,
  },
  teacher: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  daXoa: {
    type: Boolean,
    default: false,
    select: false, // ẩn khi query nếu cần
  },
}, { timestamps: true });

const Class = mongoose.model('Class', classSchema);
export default Class;
