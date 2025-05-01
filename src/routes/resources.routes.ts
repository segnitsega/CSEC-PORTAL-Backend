import express from "express"
import { addResource, deleteResource, getResources, updateResource } from "../controllers/resources.controller"
import { authenticateToken } from "../middlewares/authMiddleware"
import { validateResource } from "../middlewares/validateResources"

export const resourcesRouter = express.Router()

resourcesRouter.post('/addResource',authenticateToken, validateResource, addResource)
resourcesRouter.get('/', authenticateToken, getResources)
resourcesRouter.delete('/:id', authenticateToken, deleteResource);
resourcesRouter.put('/:id', authenticateToken, updateResource);


