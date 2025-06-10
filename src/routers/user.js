import express from 'express';
import { loginSchema, registerSchema } from '../validation/user';
import { validateRequest } from '../middleware/validateRequest';
import { dangKy, dangNhap, deleteUser, getAllUsers, getUserDetail, updateUserRole } from '../controllers/user';
import { authenticate, requireRole } from '../middleware/requireRole';

const routerUser = express.Router();

routerUser.post("/register", validateRequest(registerSchema), dangKy);
routerUser.post("/login", validateRequest(loginSchema), dangNhap);
routerUser.patch("/:id/role", authenticate, requireRole("Admin"), updateUserRole);
routerUser.get("/", authenticate, requireRole("Admin"), getAllUsers);
routerUser.delete("/:id", authenticate, requireRole("Admin"), deleteUser);
routerUser.get("/:id", authenticate, getUserDetail);

export default routerUser;