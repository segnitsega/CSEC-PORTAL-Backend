import express from "express"
import { createSession, deleteSession, getSessions, updateSession } from "../controllers/sessions.controller";
import { authenticateToken } from "../middlewares/authMiddleware";

export const sessionsRouter = express.Router();

sessionsRouter.post('/createSession', authenticateToken, createSession) 
sessionsRouter.get('/', authenticateToken, getSessions) 
sessionsRouter.delete('/:id', authenticateToken, deleteSession);
sessionsRouter.put('/:id', authenticateToken, updateSession);
