import { Request, Response } from "express";
import { attendanceService } from "../services/attendance.service";
import { handleServiceError } from "../errors/ServiceError";

export const submitAttendance = async (req: Request | any, res: Response): Promise<void> => {
  const { sessionId, records } = req.body;
  try {
    const result = await attendanceService.submitAttendance(req.user.clubRole, sessionId, records);
    res.status(200).json(result);
  } catch (error) {
    if (handleServiceError(res, error)) return;
    console.error("Error saving attendance:", error);
    res.status(500).json({ message: "Failed to save attendance" });
  }
};

export const getAttendanceData = async (req: Request, res: Response): Promise<void> => {
  const { sessionId } = req.params;
  try {
    const result = await attendanceService.getAttendanceData(sessionId);
    res.status(200).json(result);
  } catch (error) {
    if (handleServiceError(res, error)) return;
    res.status(500).json({ message: "Error loading attendance form", error });
  }
};

export const getMemberAttendanceSummary = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await attendanceService.getMemberAttendanceSummary(req.params.memberId);
    res.json(result);
  } catch (error) {
    if (handleServiceError(res, error)) return;
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};
