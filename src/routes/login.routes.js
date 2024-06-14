import { Router } from "express";
import {
    verifyDuplicateEmail,
    verifyDuplicateUsername,
} from "../middleware/verifySignup.js";
import * as loginController from "../controllers/login.controller.js";

const router = Router();

router.post("/signIn", loginController.signIn);
router.post(
    "/signUp",
    verifyDuplicateUsername,
    verifyDuplicateEmail,
    loginController.signUp
);

export default router;
