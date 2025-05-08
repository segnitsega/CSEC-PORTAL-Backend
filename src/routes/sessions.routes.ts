import express from "express"
import { createSession, deleteSession, getSessions, updateSession } from "../controllers/sessions.controller";
import { authenticateToken } from "../middlewares/authMiddleware";
import { validateSessionInput } from "../middlewares/validateCreateSession";
import { updateLastSeen } from "../middlewares/updateLastSeenMiddleware";

export const sessionsRouter = express.Router();

sessionsRouter.post('/createSession', authenticateToken, updateLastSeen, validateSessionInput, createSession) 
sessionsRouter.get('/', authenticateToken, updateLastSeen, getSessions) 
sessionsRouter.delete('/:id', authenticateToken, updateLastSeen, deleteSession);
sessionsRouter.put('/:id', authenticateToken, updateLastSeen, updateSession);
