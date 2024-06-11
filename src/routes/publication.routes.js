import { Router } from "express";
const router = Router();
import * as publicationController from "../controllers/publication.controller.js";
import fileUpload from "express-fileupload";
import { verifyToken } from "../middleware/authJwt.js";

router.post(
    "/create",
    verifyToken,
    fileUpload({
        useTempFiles: true,
        tempFileDir: "./uploads",
    }),
    publicationController.createPost
);
router.get("/all", verifyToken, publicationController.getAllPosts);
router.delete("/delete/:id", verifyToken, publicationController.deletePost);
router.put("/update/:id", verifyToken, publicationController.updatePost);

export default router;
