"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.divisionsRouter = void 0;
const express_1 = __importDefault(require("express"));
const divisions_controller_1 = require("../controllers/divisions.controller");
const authMiddleware_1 = require("../middlewares/authMiddleware");
exports.divisionsRouter = express_1.default.Router();
exports.divisionsRouter.get('/allDivisions', authMiddleware_1.authenticateToken, divisions_controller_1.getAllDivisions);
exports.divisionsRouter.get('/getGroups/:division', authMiddleware_1.authenticateToken, divisions_controller_1.getGroups);
exports.divisionsRouter.post('/createDivision', authMiddleware_1.authenticateToken, divisions_controller_1.createDivision);
