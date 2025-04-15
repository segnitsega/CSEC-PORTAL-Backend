import express from "express"
import { createDivision, getAllDivisions, getGroups } from "../controllers/divisions.controller"
import { authenticateToken } from "../middlewares/authMiddleware"

export const divisionsRouter = express.Router()

divisionsRouter.get('/allDivisions', getAllDivisions)
divisionsRouter.get('/getGroups', getGroups) 
divisionsRouter.post('/createDivision', authenticateToken, createDivision) 



