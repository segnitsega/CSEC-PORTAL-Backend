import express from "express";
import { getAttendanceData, getMemberAttendanceSummary, submitAttendance } from "../controllers/attendance.controller";

const attendanceRouter = express.Router();

attendanceRouter.post("/", submitAttendance);
attendanceRouter.get("/data/:sessionId", getAttendanceData)
attendanceRouter.get("/member/:memberId", getMemberAttendanceSummary)


export default attendanceRouter;
