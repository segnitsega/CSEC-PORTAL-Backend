import express from "express"
import { addEvent, deleteEvent, getEvents, updateEvent } from "../controllers/events.controller"
import { authenticateToken } from "../middlewares/authMiddleware"
import { validateCreateEvent } from "../middlewares/validateCreateEvent"

export const eventsRouter = express.Router()

eventsRouter.post('/addEvent', authenticateToken, validateCreateEvent, addEvent) 
eventsRouter.get('/', authenticateToken,  getEvents)
eventsRouter.delete('/:id', authenticateToken, deleteEvent);
eventsRouter.put('/:id', authenticateToken, updateEvent);
