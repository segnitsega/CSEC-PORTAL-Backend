import express from "express"
import { addResource, getResources } from "../controllers/resources.controller"
import { authenticateToken } from "../middlewares/authMiddleware"

export const resourcesRouter = express.Router()

resourcesRouter.post('/addResource',authenticateToken, addResource)
resourcesRouter.get('/', getResources)

