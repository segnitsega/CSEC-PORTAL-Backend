import express from "express"
import { addResource, deleteResource, getResources, updateResource } from "../controllers/resources.controller"
import { authenticateToken } from "../middlewares/authMiddleware"

export const resourcesRouter = express.Router()

resourcesRouter.post('/addResource',authenticateToken, addResource)
resourcesRouter.get('/', authenticateToken, getResources)
resourcesRouter.delete('/:id', authenticateToken, deleteResource);
resourcesRouter.put('/:id', authenticateToken, updateResource);


