import express from "express";
import { getAttendanceData, getMemberAttendanceSummary, submitAttendance } from "../controllers/attendance.controller";
import { authenticateToken } from "../middlewares/authMiddleware";
import { validateSubmitAttendance } from "../middlewares/validateSubmitAttendance";
import { updateLastSeen } from "../middlewares/updateLastSeenMiddleware";

const attendanceRouter = express.Router();

attendanceRouter.post("/", authenticateToken, updateLastSeen, validateSubmitAttendance, submitAttendance);
attendanceRouter.get("/data/:sessionId", authenticateToken, updateLastSeen, getAttendanceData)
attendanceRouter.get("/member/:memberId", authenticateToken, updateLastSeen, getMemberAttendanceSummary)

export default attendanceRouter;
