import express from "express"
import { addEvent, deleteEvent, getEvents, updateEvent } from "../controllers/events.controller"
import { authenticateToken } from "../middlewares/authMiddleware"
import { validateCreateEvent } from "../middlewares/validateCreateEvent"
import { updateLastSeen } from "../middlewares/updateLastSeenMiddleware"

export const eventsRouter = express.Router()

eventsRouter.post('/addEvent', authenticateToken, updateLastSeen, validateCreateEvent, addEvent) 
eventsRouter.get('/', authenticateToken, updateLastSeen, getEvents)
eventsRouter.delete('/:id', authenticateToken, updateLastSeen, deleteEvent);
eventsRouter.put('/:id', authenticateToken, updateLastSeen, updateEvent);
