import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true,
  },
  title: { type: String, required: true },
  description: String,
  dueDate: Date,
}, { timestamps: true });

export default mongoose.model("Assignment", assignmentSchema);