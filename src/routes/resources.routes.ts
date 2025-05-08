import express from "express"
import { addResource, deleteResource, getResources, updateResource } from "../controllers/resources.controller"
import { authenticateToken } from "../middlewares/authMiddleware"
import { validateResource } from "../middlewares/validateResources"
import { updateLastSeen } from "../middlewares/updateLastSeenMiddleware"

export const resourcesRouter = express.Router()

resourcesRouter.post('/addResource',authenticateToken, updateLastSeen, validateResource, addResource)
resourcesRouter.get('/', authenticateToken, updateLastSeen, getResources)
resourcesRouter.delete('/:id', authenticateToken, updateLastSeen, deleteResource);
resourcesRouter.put('/:id', authenticateToken, updateLastSeen, updateResource);