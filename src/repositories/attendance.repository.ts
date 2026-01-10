import Attendance from "../models/attendanceModel";
import type { AnyBulkWriteOperation } from "mongoose";
import type { attendanceInterface } from "../models/attendanceModel";

export const attendanceRepository = {
  bulkWrite(operations: AnyBulkWriteOperation<attendanceInterface>[]) {
    return Attendance.bulkWrite(operations);
  },

  findByMemberWithSession(memberId: string) {
    return Attendance.find({ memberId })
      .populate({
        path: "sessionId",
        select: "title startTime endTime date",
      })
      .lean();
  },
};
