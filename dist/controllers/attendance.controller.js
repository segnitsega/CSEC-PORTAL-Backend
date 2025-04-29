"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMemberAttendanceSummary = exports.getAttendanceData = exports.submitAttendance = void 0;
const attendanceModel_1 = __importDefault(require("../models/attendanceModel"));
const membersModel_1 = __importDefault(require("../models/membersModel"));
const sessionsModel_1 = __importDefault(require("../models/sessionsModel"));
const moment_1 = __importDefault(require("moment"));
const submitAttendance = async (req, res) => {
    const { sessionId, records } = req.body;
    //from frontend :
    //   req.body = {
    //     "sessionId": "abc123",
    //     "records": [
    //       { "memberId": "u123", "status": "Present" },
    //       { "memberId": "u456", "status": "Absent", "headsUp": "..."}
    //     ]
    //   }
    if (!sessionId || !Array.isArray(records) || records.length === 0) {
        res.status(400).json({ message: "sessionId and records array are required" });
        return;
    }
    try {
        const bulkOperations = records.map((record) => ({
            updateOne: {
                filter: { memberId: record.memberId, sessionId },
                update: { $set: { status: record.status, headsUp: record.headsUp, date: new Date() } },
                upsert: true,
            },
        }));
        await attendanceModel_1.default.bulkWrite(bulkOperations);
        res.status(200).json({ message: "Attendance saved successfully" });
    }
    catch (error) {
        console.error("Error saving attendance:", error);
        res.status(500).json({ message: "Failed to save attendance" });
    }
};
exports.submitAttendance = submitAttendance;
const getAttendanceData = async (req, res) => {
    const { sessionId } = req.params;
    try {
        const session = await sessionsModel_1.default.findById(sessionId);
        if (!session) {
            res.status(404).json({ message: "Session not found" });
            return;
        }
        const members = await membersModel_1.default.find({
            division: session.division,
            group: { $in: session.groups },
            membershipStatus: "Active"
        }).select("_id firstName lastName division group");
        res.status(200).json({ session, members });
    }
    catch (error) {
        res.status(500).json({ message: "Error loading attendance form", error });
    }
};
exports.getAttendanceData = getAttendanceData;
const getMemberAttendanceSummary = async (req, res) => {
    try {
        const memberId = req.params.memberId;
        const allRecords = await attendanceModel_1.default.find({ memberId })
            .populate({
            path: "sessionId",
            select: "title startTime endTime date",
        })
            .lean();
        const transformRecord = (record) => {
            const session = record.sessionId;
            return {
                _id: record._id,
                date: record.date,
                status: record.status,
                sessionTitle: (session === null || session === void 0 ? void 0 : session.title) || "N/A",
                day: (0, moment_1.default)((session === null || session === void 0 ? void 0 : session.date) || record.date).format("dddd"),
                startTime: (0, moment_1.default)(session === null || session === void 0 ? void 0 : session.startTime).format("hh:mm A"),
                endTime: (0, moment_1.default)(session === null || session === void 0 ? void 0 : session.endTime).format("hh:mm A"),
                headsUp: record.headsUp || null
            };
        };
        const getStats = (records) => {
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
        const now = (0, moment_1.default)();
        const startOfWeek = now.clone().startOf("week");
        const startOfMonth = now.clone().startOf("month");
        const weekRecords = allRecords.filter(r => (0, moment_1.default)(r.date).isSameOrAfter(startOfWeek));
        const monthRecords = allRecords.filter(r => (0, moment_1.default)(r.date).isSameOrAfter(startOfMonth));
        const overallRecords = allRecords;
        res.json({
            week: getStats(weekRecords),
            month: getStats(monthRecords),
            overall: getStats(overallRecords)
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error." });
    }
};
exports.getMemberAttendanceSummary = getMemberAttendanceSummary;
