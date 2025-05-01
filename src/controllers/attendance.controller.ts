import { Request, Response } from "express";
import Attendance from "../models/attendanceModel";
import Member from "../models/membersModel";
import DivisionGroup from "../models/divisionGroupModel"
import Session from "../models/sessionsModel";
import moment from "moment";


export const submitAttendance = async (req: Request | any, res: Response): Promise<void> => {
  const { sessionId, records } = req.body;
  const { clubRole } = req.user
  if(clubRole === "Member"){
    res.status(403).json({message: "Unauthorized to submit attendance"})
    return;
} 
//from frontend :
//   req.body = {
//     "sessionId": "abc123",
//     "records": [
//       { "memberId": "u123", "status": "Present" },
//       { "memberId": "u456", "status": "Absent", "headsUp": "..."}
//     ]
//   }

  const session = await Session.findById(sessionId)
  if(!session){
    res.status(400).json({message: `Session with id ${sessionId} not found`})
    return
  }

  const sessionDivision = session?.division
  const topRoles = ["President", "Vice President"]

  const availableDivisions = await DivisionGroup.distinct('division'); 
  const divisionPresidents:{[key: string]: string} = {}
  availableDivisions.forEach((division) => {
      divisionPresidents[`${division} President`] = division
  })
  if (!topRoles.includes(clubRole) && divisionPresidents[clubRole] !== sessionDivision){
    res.status(403).json({ message: `${clubRole} can not submit attendance in ${sessionDivision} ` })
    return
  }
    try {
    const bulkOperations = records.map((record: any) => ({
      updateOne: {
        filter: { memberId: record.memberId, sessionId },
        update: { $set: { status: record.status, headsUp: record.headsUp, date: new Date() } },
        upsert: true,
      },
    }));

    await Attendance.bulkWrite(bulkOperations);
    res.status(200).json({ message: "Attendance saved successfully" });
  } catch (error) {
    console.error("Error saving attendance:", error);
    res.status(500).json({ message: "Failed to save attendance" });
  }

};

export const getAttendanceData = async (req: Request, res: Response): Promise<void> => {
    const { sessionId } = req.params;
    try {
      const session = await Session.findById(sessionId);
      if (!session){ 
        res.status(404).json({ message: "Session not found" });
        return
      } 
      const members = await Member.find({
        division: session.division,
        group: { $in: session.groups },
        membershipStatus: "Active"
      }).select("_id firstName lastName division group");
  
      res.status(200).json({ session, members });
    } catch (error) {
      res.status(500).json({ message: "Error loading attendance form", error });
    }
  };

export const getMemberAttendanceSummary = async (req: Request, res: Response): Promise<void> => {
  try {
    const memberId = req.params.memberId;

    const allRecords = await Attendance.find({ memberId })
      .populate({
        path: "sessionId",
        select: "title startTime endTime date",
      })
      .lean();

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
        headsUp: record.headsUp || null
      };
    };

    const getStats = (records: any[]) => {
      const present = records.filter(r => r.status === "Present").length;
      const headsUpCount = records.filter(r => r.status === "Excused").length;
      const total = records.length;

      return {
        percentage: total > 0 ? Math.round((present / total) * 100) : 0,
        total,
        present,
        headsUp: {
          count: headsUpCount,
          percentage: total > 0 ? Math.round((headsUpCount / total) * 100) : 0
        },
        records: records.map(transformRecord)
      };
    };

    const now = moment();
    const startOfWeek = now.clone().startOf("week");
    const startOfMonth = now.clone().startOf("month");

    const weekRecords = allRecords.filter(r => moment(r.date).isSameOrAfter(startOfWeek));
    const monthRecords = allRecords.filter(r => moment(r.date).isSameOrAfter(startOfMonth));
    const overallRecords = allRecords;

    res.json({
      week: getStats(weekRecords),
      month: getStats(monthRecords),
      overall: getStats(overallRecords)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};
