import { Router } from "express";
import { verifyDuplicateEmail } from "../middleware/verifySignup.js";
import * as loginController from "../controllers/login.controller.js";

const router = Router();

router.post("/signIn", loginController.signIn);
router.post("/signUp",verifyDuplicateEmail,loginController.signUp);




export default router;