"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const attendance_controller_1 = require("../controllers/attendance.controller");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const attendanceRouter = express_1.default.Router();
attendanceRouter.post("/", authMiddleware_1.authenticateToken, attendance_controller_1.submitAttendance);
attendanceRouter.get("/data/:sessionId", authMiddleware_1.authenticateToken, attendance_controller_1.getAttendanceData);
attendanceRouter.get("/member/:memberId", authMiddleware_1.authenticateToken, attendance_controller_1.getMemberAttendanceSummary);
exports.default = attendanceRouter;
