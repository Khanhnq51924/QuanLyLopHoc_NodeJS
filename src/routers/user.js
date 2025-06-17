    import express from 'express';
    import { loginSchema, registerSchema } from '../validation/user';
    import { validateRequest } from '../middleware/validateRequest';
    import { dangKy, dangKyGiaoVien, dangNhap, deleteUser, duyetDangKyGV, getAllUsers, getDanhSachDangKyGV, getUserDetail, getUserProfile, khoiPhucTaiKhoanTuChoi, updateUserRole } from '../controllers/user';
    import { authenticate, requireRole } from '../middleware/requireRole';
    import { registerTeacherSchema } from '../validation/teacher';

    const routerUser = express.Router();

    routerUser.post("/register", validateRequest(registerSchema), dangKy);
    routerUser.post("/login", validateRequest(loginSchema), dangNhap);
    routerUser.get("/", authenticate, requireRole("Admin"), getAllUsers);
    routerUser.delete("/:id", authenticate, requireRole("Admin"), deleteUser);
    routerUser.post("/register-teacher", validateRequest(registerTeacherSchema), dangKyGiaoVien);
    routerUser.get("/list-teacher", authenticate, requireRole("Admin"), getDanhSachDangKyGV);
    routerUser.patch("/check/:id", authenticate, requireRole("Admin"), duyetDangKyGV);
    routerUser.patch("/restore/:id", authenticate, requireRole("Admin"), khoiPhucTaiKhoanTuChoi);
    routerUser.get("/:id", authenticate, getUserDetail);
    routerUser.get('/profile', authenticate, getUserProfile);


    export default routerUser;