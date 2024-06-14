import { Router } from "express";
const router = Router();
import * as profileController from "../controllers/profile.controller.js";
import { verifyToken } from "../middleware/authJwt.js";

router.put("/update/:id", verifyToken, profileController.updateProfile);

export default router;
