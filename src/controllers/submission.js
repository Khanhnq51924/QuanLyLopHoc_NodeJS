import Submission from '../models/submission';
import Student from '../models/student';

// Tạo bài nộp mới
export const createSubmission = async (req, res) => {
  try {
    const { studentId, assignmentId, content, fileUrl } = req.body;
    const submission = await Submission.create({
      studentId,
      assignmentId,
      content,
      fileUrl,
      status: 'pending'
    });
    return res.status(201).json({ message: 'Tạo bài nộp thành công', submission });
  } catch (error) {
    return res.status(500).json({ message: 'Tạo bài nộp thất bại', error: error.message });
  }
};

// Lấy danh sách bài nộp (admin/giao vien xem tất cả, hoc sinh chỉ xem bài của mình)
export const getAllSubmissions = async (req, res) => {
  try {
    const { role, _id } = req.user;
    let filter = {};
    if (role === 'Student') {
      filter.studentId = _id;
    }
    const submissions = await Submission.find(filter).populate('studentId', 'name studentId').populate('assignmentId', 'title');
    return res.status(200).json({ submissions });
  } catch (error) {
    return res.status(500).json({ message: 'Lấy danh sách bài nộp thất bại', error: error.message });
  }
};

// Lấy chi tiết bài nộp
export const getSubmissionDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, _id } = req.user;
    let filter = { _id: id };
    if (role === 'Student') {
      filter.studentId = _id;
    }
    const submission = await Submission.findOne(filter).populate('studentId', 'name studentId').populate('assignmentId', 'title');
    if (!submission) return res.status(404).json({ message: 'Không tìm thấy bài nộp' });
    return res.status(200).json({ submission });
  } catch (error) {
    return res.status(500).json({ message: 'Lấy chi tiết bài nộp thất bại', error: error.message });
  }
};

// Cập nhật bài nộp (admin/giao vien có thể cập nhật status và feedback)
export const updateSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, _id } = req.user;
    const { content, fileUrl, status, feedback } = req.body;
    let updateData = {};
    if (role === 'Student') {
      updateData = { content, fileUrl };
    } else {
      updateData = { status, feedback };
    }
    const submission = await Submission.findOneAndUpdate(
      { _id: id, ...(role === 'Student' ? { studentId: _id } : {}) },
      updateData,
      { new: true, runValidators: true }
    );
    if (!submission) return res.status(404).json({ message: 'Không tìm thấy bài nộp' });
    return res.status(200).json({ message: 'Cập nhật bài nộp thành công', submission });
  } catch (error) {
    return res.status(500).json({ message: 'Cập nhật bài nộp thất bại', error: error.message });
  }
};

// Xóa bài nộp (admin/giao vien)
export const deleteSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const submission = await Submission.findByIdAndDelete(id);
    if (!submission) return res.status(404).json({ message: 'Không tìm thấy bài nộp' });
    return res.status(200).json({ message: 'Xóa bài nộp thành công' });
  } catch (error) {
    return res.status(500).json({ message: 'Xóa bài nộp thất bại', error: error.message });
  }
};

// Lấy bài nộp theo sinh viên
export const getSubmissionsByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { role, _id } = req.user;
    if (role === 'Student' && _id.toString() !== studentId) {
      return res.status(403).json({ message: 'Bạn không có quyền xem bài nộp của sinh viên khác' });
    }
    const submissions = await Submission.find({ studentId }).populate('assignmentId', 'title');
    return res.status(200).json({ submissions });
  } catch (error) {
    return res.status(500).json({ message: 'Lấy bài nộp theo sinh viên thất bại', error: error.message });
  }
};

// Lấy bài nộp theo bài tập
export const getSubmissionsByAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const submissions = await Submission.find({ assignmentId }).populate('studentId', 'name studentId');
    return res.status(200).json({ submissions });
  } catch (error) {
    return res.status(500).json({ message: 'Lấy bài nộp theo bài tập thất bại', error: error.message });
  }
};

// Đánh giá bài nộp (giao vien)
export const gradeSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { score, status, feedback, detailedFeedback } = req.body;
    const teacherId = req.user._id;

    const submission = await Submission.findByIdAndUpdate(
      id,
      {
        score,
        status,
        feedback,
        detailedFeedback,
        gradedBy: teacherId,
        gradedAt: new Date()
      },
      { new: true, runValidators: true }
    ).populate('studentId', 'name studentId').populate('assignmentId', 'title');

    if (!submission) {
      return res.status(404).json({ message: 'Không tìm thấy bài nộp' });
    }

    return res.status(200).json({
      message: 'Đánh giá bài nộp thành công',
      submission
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Đánh giá bài nộp thất bại',
      error: error.message
    });
  }
};

// Lấy danh sách bài tập và trạng thái nộp
export const getAssignmentStatus = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { role, _id } = req.user;

    // Lấy tất cả sinh viên
    const students = await Student.find({});
    
    // Lấy tất cả bài nộp của bài tập này
    const submissions = await Submission.find({ assignmentId })
      .populate('studentId', 'name studentId')
      .populate('gradedBy', 'name');

    // tao map để dễ dàng tìm bài nộp theo studentId
    const submissionMap = new Map(
      submissions.map(sub => [sub.studentId._id.toString(), sub])
    );

    // taoj danh sách kết quả
    const result = students.map(student => {
      const submission = submissionMap.get(student._id.toString());
      return {
        studentId: student._id,
        studentName: student.name,
        studentCode: student.studentId,
        className: student.className,
        status: submission ? 'submitted' : 'not_submitted',
        submission: submission ? {
          _id: submission._id,
          content: submission.content,
          fileUrl: submission.fileUrl,
          score: submission.score,
          status: submission.status,
          feedback: submission.feedback,
          detailedFeedback: submission.detailedFeedback,
          gradedBy: submission.gradedBy ? {
            name: submission.gradedBy.name
          } : null,
          gradedAt: submission.gradedAt,
          submittedAt: submission.createdAt
        } : null
      };
    });

    return res.status(200).json({
      assignmentId,
      submissions: result
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Lấy danh sách trạng thái bài nộp thất bại',
      error: error.message
    });
  }
};

// Thêm comment cho bài nộp (giao vien)
export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;
    const teacherId = req.user._id;

    const submission = await Submission.findByIdAndUpdate(
      id,
      {
        $push: {
          comments: {
            content: comment,
            teacherId,
            createdAt: new Date()
          }
        }
      },
      { new: true }
    ).populate('studentId', 'name studentId')
     .populate('comments.teacherId', 'name');

    if (!submission) {
      return res.status(404).json({ message: 'Không tìm thấy bài nộp' });
    }

    return res.status(200).json({
      message: 'Thêm comment thành công',
      submission
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Thêm comment thất bại',
      error: error.message
    });
  }
}; 