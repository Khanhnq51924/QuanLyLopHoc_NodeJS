import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: [true, 'Mã sinh viên không được để trống']
  },
  assignmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
    required: [true, 'Mã bài tập không được để trống']
  },
  content: {
    type: String,
    required: [true, 'Nội dung bài nộp không được để trống'],
    trim: true
  },
  fileUrl: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'approved', 'rejected'],
      default: 'pending'
    }
  },
  score: {
    type: Number,
    min: [0, 'Điểm không được nhỏ hơn 0'],
    max: [10, 'Điểm không được lớn hơn 10']
  },
  feedback: {
    type: String,
    trim: true
  },
  detailedFeedback: {
    type: String,
    trim: true
  },
  gradedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  gradedAt: {
    type: Date
  },
  comments: [{
    content: {
      type: String,
      required: true,
      trim: true
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

const Submission = mongoose.model('Submission', submissionSchema);
export default Submission; 