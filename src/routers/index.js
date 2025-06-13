import { Router } from "express";
import routerUser from "./user";
import routerStudent from "./student";

const router = Router();
router.use("/user",routerUser)
router.use("/students", routerStudent);
export default router;