import express from "express"
import { createDivision, getAllDivisions, getDivisionMembers, getGroups } from "../controllers/divisions.controller"
import { authenticateToken } from "../middlewares/authMiddleware"
import { validateCreateDivision } from "../middlewares/validateCreateDivision"
import { updateLastSeen } from "../middlewares/updateLastSeenMiddleware"

export const divisionsRouter = express.Router()

divisionsRouter.get('/allDivisions', authenticateToken, updateLastSeen, getAllDivisions)
divisionsRouter.get('/members/:division', authenticateToken, updateLastSeen, getDivisionMembers)
divisionsRouter.get('/getGroups/:division', authenticateToken, updateLastSeen, getGroups) 
divisionsRouter.post('/createDivision', authenticateToken, updateLastSeen, validateCreateDivision, createDivision) 
