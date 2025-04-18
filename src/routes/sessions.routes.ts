import express from "express"
import { createSession } from "../controllers/sessions.controller";
import { authenticateToken } from "../middlewares/authMiddleware";

export const sessionsRouter = express.Router();

sessionsRouter.post('/createSession', authenticateToken, createSession) 