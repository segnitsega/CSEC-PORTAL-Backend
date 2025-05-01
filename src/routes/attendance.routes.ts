import express from "express";
import { getAttendanceData, getMemberAttendanceSummary, submitAttendance } from "../controllers/attendance.controller";
import { authenticateToken } from "../middlewares/authMiddleware";
import { validateSubmitAttendance } from "../middlewares/validateSubmitAttendance";

const attendanceRouter = express.Router();

attendanceRouter.post("/", authenticateToken, validateSubmitAttendance, submitAttendance);
attendanceRouter.get("/data/:sessionId", authenticateToken, getAttendanceData)
attendanceRouter.get("/member/:memberId", authenticateToken, getMemberAttendanceSummary)

export default attendanceRouter;
