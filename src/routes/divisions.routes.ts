import express from "express"
import { createDivision, getAllDivisions, getGroups } from "../controllers/divisions.controller"
import { authenticateToken } from "../middlewares/authMiddleware"
import { validateCreateDivision } from "../middlewares/validateCreateDivision"

export const divisionsRouter = express.Router()

divisionsRouter.get('/allDivisions', authenticateToken, getAllDivisions)
divisionsRouter.get('/getGroups/:division', authenticateToken, getGroups) 
divisionsRouter.post('/createDivision', authenticateToken, validateCreateDivision, createDivision) 
