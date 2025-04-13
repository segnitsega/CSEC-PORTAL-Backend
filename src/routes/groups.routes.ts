import express from "express"
import { createGroup } from "../controllers/divisionGroups.controller"
import { authenticateToken } from "../middlewares/authMiddleware"

export const groupsRouter = express.Router()

groupsRouter.post('/createGroup', authenticateToken, createGroup)
