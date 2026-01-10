import moment from "moment";
import { attendanceRepository } from "../repositories/attendance.repository";
import { memberRepository } from "../repositories/member.repository";
import { sessionRepository } from "../repositories/session.repository";
import { canManageDivision } from "../utils/checkDivisionHead";
import { ServiceError } from "../errors/ServiceError";

interface AttendanceRecord {
  memberId: string;
  status: string;
  headsUp?: string;
}

export const attendanceService = {
  async submitAttendance(
    actorClubRole: string,
    sessionId: string,
    records: AttendanceRecord[]
  ) {
    if (actorClubRole === "Member") {
      throw ServiceError.message(403, "Unauthorized to submit attendance");
    }
    const session = await sessionRepository.findById(sessionId);
    if (!session) {
      throw ServiceError.message(400, `Session with id ${sessionId} not found`);
    }
    const sessionDivision = session.division;
    const allowed = await canManageDivision(actorClubRole, sessionDivision);
    if (!allowed) {
      throw ServiceError.message(
        403,
        `${actorClubRole} can not submit attendance in ${sessionDivision} `
      );
    }

    const bulkOperations = records.map((record) => ({
      updateOne: {
        filter: { memberId: record.memberId, sessionId },
        update: {
          $set: { status: record.status, headsUp: record.headsUp, date: new Date() },
        },
        upsert: true,
      },
    }));

    if (session.status === "started" || session.status === "on-going") {
      await attendanceRepository.bulkWrite(bulkOperations as any);
      return { message: "Attendance saved successfully" };
    }
    throw ServiceError.message(
      400,
      `can not submit attendance for session status: ${session.status}`
    );
  },

  async getAttendanceData(sessionId: string) {
    const session = await sessionRepository.findById(sessionId);
    if (!session) {
      throw ServiceError.message(404, "Session not found");
    }
    const members = await memberRepository.findMembersForAttendance(
      session.division,
      session.groups
    );
    return { session, members };
  },

  async getMemberAttendanceSummary(memberId: string) {
    const allRecords = await attendanceRepository.findByMemberWithSession(memberId);

    const transformRecord = (record: any) => {
      const session = record.sessionId;
      return {
        _id: record._id,
        date: record.date,
        status: record.status,
        sessionTitle: session?.title || "N/A",
        day: moment(session?.date || record.date).format("dddd"),
        startTime: moment(session?.startTime).format("hh:mm A"),
        endTime: moment(session?.endTime).format("hh:mm A"),
        headsUp: record.headsUp || null,
      };
    };

    const getStats = (records: any[]) => {
      const present = records.filter((r) => r.status === "Present").length;
      const headsUpCount = records.filter((r) => r.status === "Excused").length;
      const total = records.length;

      return {
        percentage: total > 0 ? Math.round((present / total) * 100) : 0,
        total,
        present,
        headsUp: {
          count: headsUpCount,
          percentage: total > 0 ? Math.round((headsUpCount / total) * 100) : 0,
        },
        records: records.map(transformRecord),
      };
    };

    const now = moment();
    const startOfWeek = now.clone().startOf("week");
    const startOfMonth = now.clone().startOf("month");

    const weekRecords = allRecords.filter((r) =>
      moment(r.date).isSameOrAfter(startOfWeek)
    );
    const monthRecords = allRecords.filter((r) =>
      moment(r.date).isSameOrAfter(startOfMonth)
    );
    const overallRecords = allRecords;

    return {
      week: getStats(weekRecords),
      month: getStats(monthRecords),
      overall: getStats(overallRecords),
    };
  },
};
