import { Request, Response } from "express";
import Attendance from "../models/attendance";
import Member from "../models/membersModel";
import Session from "../models/sessionsModel";
import mongoose from "mongoose";


export const submitAttendance = async (req: Request, res: Response): Promise<void> => {
  const { sessionId, records } = req.body;

//from frontend :
//   req.body = {
//     "sessionId": "abc123",
//     "records": [
//       { "memberId": "u123", "status": "Present" },
//       { "memberId": "u456", "status": "Absent" }
//     ]
//   }

if (!sessionId || !Array.isArray(records) || records.length === 0) {
    res.status(400).json({ message: "sessionId and records array are required" });
    return;
  }

  try {
    const bulkOperations = records.map((record: any) => ({
      updateOne: {
        filter: { memberId: record.memberId, sessionId },
        update: { $set: { status: record.status, date: new Date() } },
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

export const getMemberAttendanceSummary = async (req: Request, res: Response) => {
    const { memberId } = req.params;
  
    try {
      const now = new Date();
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 7);
  
      const monthAgo = new Date(now);
      monthAgo.setDate(now.getDate() - 30);
  
      const getSummary = async (since: Date) => {
        const records = await Attendance.aggregate([
          { $match: { memberId: new mongoose.Types.ObjectId(memberId), date: { $gte: since } } },
          { $group: {
              _id: "$status",
              count: { $sum: 1 }
          }}
        ]);
        const total = records.reduce((acc, r) => acc + r.count, 0);
        const present = records.find(r => r._id === "Present")?.count || 0;
        return {
          percentage: total === 0 ? 0 : Math.round((present / total) * 100),
          total,
          present
        };
      };
  
      const summary = {
        week: await getSummary(weekAgo),
        month: await getSummary(monthAgo),
        overall: await getSummary(new Date("2000-01-01"))
      };
  
      res.status(200).json(summary);
    } catch (error) {
      res.status(500).json({ message: "Error fetching attendance summary", error });
    }
  };



