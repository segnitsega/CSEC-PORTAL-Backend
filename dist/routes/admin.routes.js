"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRouter = void 0;
const express_1 = __importDefault(require("express"));
const admin_controller_1 = require("../controllers/admin.controller");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const validatePermissions_1 = require("../middlewares/validatePermissions");
const validateNewRoleData_1 = require("../middlewares/validateNewRoleData");
exports.adminRouter = express_1.default.Router();
exports.adminRouter.post("/heads", authMiddleware_1.authenticateToken, validateNewRoleData_1.validateAddNewRole, admin_controller_1.addNewRole);
exports.adminRouter.post("/permissions", authMiddleware_1.authenticateToken, validatePermissions_1.validateAddPermissions, admin_controller_1.addPermissions);
