import express from "express"
import { createSession, getSessions } from "../controllers/sessions.controller";
import { authenticateToken } from "../middlewares/authMiddleware";

export const sessionsRouter = express.Router();

sessionsRouter.post('/createSession', authenticateToken, createSession) 
sessionsRouter.get('/', getSessions)