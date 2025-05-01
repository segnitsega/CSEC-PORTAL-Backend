import express from "express"
import { createSession, deleteSession, getSessions, updateSession } from "../controllers/sessions.controller";
import { authenticateToken } from "../middlewares/authMiddleware";
import { validateSessionInput } from "../middlewares/validateCreateSession";

export const sessionsRouter = express.Router();

sessionsRouter.post('/createSession', authenticateToken, validateSessionInput, createSession) 
sessionsRouter.get('/', authenticateToken, getSessions) 
sessionsRouter.delete('/:id', authenticateToken, deleteSession);
sessionsRouter.put('/:id', authenticateToken, updateSession);
