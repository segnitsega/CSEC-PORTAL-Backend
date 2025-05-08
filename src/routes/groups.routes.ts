import express from "express"
import { createGroup, getGroupMembers } from "../controllers/divisionGroups.controller"
import { authenticateToken } from "../middlewares/authMiddleware"
import { validateCreateGroup } from "../middlewares/validateCreateGroup"
import { updateLastSeen } from "../middlewares/updateLastSeenMiddleware"

export const groupsRouter = express.Router()

groupsRouter.post('/createGroup', authenticateToken, updateLastSeen, validateCreateGroup, createGroup)
groupsRouter.get('/getMembers', authenticateToken, updateLastSeen, getGroupMembers)

