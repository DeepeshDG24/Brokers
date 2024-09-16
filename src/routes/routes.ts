import { Router } from "express";
import authMiddleware from "../middleware/middleware";
import { getEmbedToken, login, loginStatus } from "../controllers/authController";

const router = Router();

router.post('/login', login);

router.get('/loginStatus', authMiddleware, loginStatus);

router.get('/getEmbedToken', authMiddleware, getEmbedToken);

export default router;
