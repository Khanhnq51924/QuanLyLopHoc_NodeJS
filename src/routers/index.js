import { Router } from "express";
import routerUser from "./user";
import routerStudent from "./student";
import routerSubmission from "./submission";
import routerClass from "./class";
import routerASM from "./assignment";

const router = Router();
router.use("/user",routerUser)
router.use("/students", routerStudent);
router.use("/submissions", routerSubmission);
router.use("/class", routerClass);
router.use("/assignment", routerASM);
export default router;