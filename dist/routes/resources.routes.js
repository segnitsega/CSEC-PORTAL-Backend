"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resourcesRouter = void 0;
const express_1 = __importDefault(require("express"));
const resources_controller_1 = require("../controllers/resources.controller");
const authMiddleware_1 = require("../middlewares/authMiddleware");
exports.resourcesRouter = express_1.default.Router();
exports.resourcesRouter.post('/addResource', authMiddleware_1.authenticateToken, resources_controller_1.addResource);
exports.resourcesRouter.get('/', authMiddleware_1.authenticateToken, resources_controller_1.getResources);
exports.resourcesRouter.delete('/:id', authMiddleware_1.authenticateToken, resources_controller_1.deleteResource);
exports.resourcesRouter.put('/:id', authMiddleware_1.authenticateToken, resources_controller_1.updateResource);
