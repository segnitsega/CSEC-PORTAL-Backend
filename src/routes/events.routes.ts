import express from "express"
import { addEvent, deleteEvent, getEvents, updateEvent } from "../controllers/events.controller"
import { authenticateToken } from "../middlewares/authMiddleware"

export const eventsRouter = express.Router()

eventsRouter.post('/addEvent', authenticateToken, addEvent) 
eventsRouter.get('/', authenticateToken,  getEvents)
eventsRouter.delete('/:id', authenticateToken, deleteEvent);
eventsRouter.put('/:id', authenticateToken, updateEvent);
