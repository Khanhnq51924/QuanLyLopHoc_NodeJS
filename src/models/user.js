// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tên không được để trống"],
      trim: true,
      minlength: [2, "Tên phải có ít nhất 2 ký tự"],
      maxlength: [100, "Tên không được vượt quá 100 ký tự"],
    },
    email: {
      type: String,
      required: [true, "Email không được để trống"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, "Email không hợp lệ"],
    },
    password: {
      type: String,
      required: [true, "Mật khẩu không được để trống"],
      minlength: [6, "Mật khẩu phải có ít nhất 6 ký tự"],
    },
    role: {
      type: String,
      enum: {
        values: ["Admin", "Teacher", "Student","custom"],
        default: "Student",
      },
    },
    active: {
      type: Boolean,
      default: true,
      select: true,
    },
    status: {
      type: String,
      enum: ["cho", "xac_nhan", "tu_choi"],
      default: "cho",
    },
    avata: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },
    content: {
      type: String,
      trim: true,
    },
    daXoa: {
      type: Boolean,
      default: false,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
export default User;
