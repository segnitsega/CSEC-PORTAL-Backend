"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionsRouter = void 0;
const express_1 = __importDefault(require("express"));
const sessions_controller_1 = require("../controllers/sessions.controller");
const authMiddleware_1 = require("../middlewares/authMiddleware");
exports.sessionsRouter = express_1.default.Router();
exports.sessionsRouter.post('/createSession', authMiddleware_1.authenticateToken, sessions_controller_1.createSession);
exports.sessionsRouter.get('/', authMiddleware_1.authenticateToken, sessions_controller_1.getSessions);
exports.sessionsRouter.delete('/:id', authMiddleware_1.authenticateToken, sessions_controller_1.deleteSession);
exports.sessionsRouter.put('/:id', authMiddleware_1.authenticateToken, sessions_controller_1.updateSession);
