"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupsRouter = void 0;
const express_1 = __importDefault(require("express"));
const divisionGroups_controller_1 = require("../controllers/divisionGroups.controller");
const authMiddleware_1 = require("../middlewares/authMiddleware");
exports.groupsRouter = express_1.default.Router();
exports.groupsRouter.post('/createGroup', authMiddleware_1.authenticateToken, divisionGroups_controller_1.createGroup);
exports.groupsRouter.get('/getMembers', authMiddleware_1.authenticateToken, divisionGroups_controller_1.getGroupMembers);
