import { Router } from "express";
import routerUser from "./user";
import routerStudent from "./student";
import routerSubmission from "./submission";

const router = Router();
router.use("/user",routerUser)
router.use("/students", routerStudent);
router.use("/submissions", routerSubmission);
export default router;