const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const classSchema = new Schema({
  className: {
    type: String,
    required: true
  },
  teacher: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  daXoa: {
  type: Boolean,
  default: false,
  select: false, // ẩn khi query nếu cần
},

}, { timestamps: true });

module.exports = mongoose.model('Class', classSchema);
