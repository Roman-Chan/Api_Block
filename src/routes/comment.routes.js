import Router from 'express';
const router = Router();
import * as commentController from '../controllers/comment.controller.js';
import { verifyToken } from '../middleware/authJwt.js';


router.post('/create',verifyToken, commentController.createComment);
router.get('/publication/:publicationId',verifyToken, commentController.getCommentsByPublication);




export default router;