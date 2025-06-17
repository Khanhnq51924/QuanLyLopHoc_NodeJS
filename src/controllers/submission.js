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
      status: 'pending',
      daXoa: false
    });
    return res.status(201).json({ message: 'Tạo bài nộp thành công', submission });
  } catch (error) {
    return res.status(500).json({ message: 'Tạo bài nộp thất bại', error: error.message });
  }
};

// Lấy danh sách bài nộp (lọc daXoa)
export const getAllSubmissions = async (req, res) => {
  try {
    const { role, _id } = req.user;
    let filter = { daXoa: false };
    if (role === 'Student') {
      filter.studentId = _id;
    }
    const submissions = await Submission.find(filter)
      .populate('studentId', 'name studentId')
      .populate('assignmentId', 'title');
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
    let filter = { _id: id, daXoa: false };
    if (role === 'Student') {
      filter.studentId = _id;
    }
    const submission = await Submission.findOne(filter)
      .populate('studentId', 'name studentId')
      .populate('assignmentId', 'title');
    if (!submission) return res.status(404).json({ message: 'Không tìm thấy bài nộp' });
    return res.status(200).json({ submission });
  } catch (error) {
    return res.status(500).json({ message: 'Lấy chi tiết bài nộp thất bại', error: error.message });
  }
};

// Cập nhật bài nộp
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
      { _id: id, daXoa: false, ...(role === 'Student' ? { studentId: _id } : {}) },
      updateData,
      { new: true, runValidators: true }
    );
    if (!submission) return res.status(404).json({ message: 'Không tìm thấy bài nộp' });
    return res.status(200).json({ message: 'Cập nhật bài nộp thành công', submission });
  } catch (error) {
    return res.status(500).json({ message: 'Cập nhật bài nộp thất bại', error: error.message });
  }
};

// Xóa mềm bài nộp
export const deleteSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const submission = await Submission.findByIdAndUpdate(
      id,
      { daXoa: true },
      { new: true }
    );
    if (!submission) return res.status(404).json({ message: 'Không tìm thấy bài nộp' });
    return res.status(200).json({ message: 'Đã xóa mềm bài nộp thành công' });
  } catch (error) {
    return res.status(500).json({ message: 'Xóa bài nộp thất bại', error: error.message });
  }
};

// Khôi phục bài nộp đã xóa mềm
export const restoreSubmission = async (req, res) => {
  try {
    const { id } = req.params;

    const submission = await Submission.findByIdAndUpdate(
      id,
      { daXoa: false },
      { new: true }
    );

    if (!submission) {
      return res.status(404).json({ message: 'Không tìm thấy bài nộp để khôi phục' });
    }

    return res.status(200).json({
      message: 'Khôi phục bài nộp thành công',
      submission
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Khôi phục bài nộp thất bại',
      error: error.message
    });
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
    const submissions = await Submission.find({ studentId, daXoa: false }).populate('assignmentId', 'title');
    return res.status(200).json({ submissions });
  } catch (error) {
    return res.status(500).json({ message: 'Lấy bài nộp theo sinh viên thất bại', error: error.message });
  }
};

// Lấy bài nộp theo bài tập
export const getSubmissionsByAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const submissions = await Submission.find({ assignmentId, daXoa: false }).populate('studentId', 'name studentId');
    return res.status(200).json({ submissions });
  } catch (error) {
    return res.status(500).json({ message: 'Lấy bài nộp theo bài tập thất bại', error: error.message });
  }
};

// Đánh giá bài nộp
export const gradeSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { score, status, feedback, detailedFeedback } = req.body;
    const teacherId = req.user._id;

    const submission = await Submission.findOneAndUpdate(
      { _id: id, daXoa: false },
      {
        score,
        status,
        feedback,
        detailedFeedback,
        gradedBy: teacherId,
        gradedAt: new Date()
      },
      { new: true, runValidators: true }
    ).populate('studentId', 'name studentId')
     .populate('assignmentId', 'title');

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
    const students = await Student.find({});
    const submissions = await Submission.find({ assignmentId, daXoa: false })
      .populate('studentId', 'name studentId')
      .populate('gradedBy', 'name');

    const submissionMap = new Map(
      submissions.map(sub => [sub.studentId._id.toString(), sub])
    );

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

// Thêm comment
export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;
    const teacherId = req.user._id;

    const submission = await Submission.findOneAndUpdate(
      { _id: id, daXoa: false },
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
