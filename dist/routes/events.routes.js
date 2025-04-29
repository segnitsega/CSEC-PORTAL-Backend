"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventsRouter = void 0;
const express_1 = __importDefault(require("express"));
const events_controller_1 = require("../controllers/events.controller");
const authMiddleware_1 = require("../middlewares/authMiddleware");
exports.eventsRouter = express_1.default.Router();
exports.eventsRouter.post('/addEvent', authMiddleware_1.authenticateToken, events_controller_1.addEvent);
exports.eventsRouter.get('/', authMiddleware_1.authenticateToken, events_controller_1.getEvents);
exports.eventsRouter.delete('/:id', authMiddleware_1.authenticateToken, events_controller_1.deleteEvent);
exports.eventsRouter.put('/:id', authMiddleware_1.authenticateToken, events_controller_1.updateEvent);
