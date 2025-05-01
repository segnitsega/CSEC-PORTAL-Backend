import express from "express"
import { createGroup, getGroupMembers } from "../controllers/divisionGroups.controller"
import { authenticateToken } from "../middlewares/authMiddleware"
import { validateCreateGroup } from "../middlewares/validateCreateGroup"

export const groupsRouter = express.Router()

groupsRouter.post('/createGroup', authenticateToken, validateCreateGroup, createGroup)
groupsRouter.get('/getMembers', authenticateToken, getGroupMembers)

