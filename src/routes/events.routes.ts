import express from "express"
import { addEvent, getEvents } from "../controllers/events.controller"
import { authenticateToken } from "../middlewares/authMiddleware"

export const eventsRouter = express.Router()

eventsRouter.post('/addEvent', authenticateToken, addEvent) 
eventsRouter.get('/', getEvents)