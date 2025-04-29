"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSession = exports.deleteSession = exports.getSessions = exports.createSession = void 0;
const sessionsModel_1 = __importDefault(require("../models/sessionsModel"));
const divisionGroupModel_1 = __importDefault(require("../models/divisionGroupModel"));
const dayjs_1 = __importDefault(require("dayjs"));
const createSession = async (req, res) => {
    const { clubRole } = req.user;
    if (clubRole === "Member") {
        res.status(403).json({ message: `${clubRole} can not create a session` });
        return;
    }
    const { sessionTitle, division, groups, startDate, endDate, sessions } = req.body;
    if (!sessionTitle || !division || !groups || !startDate || !endDate) {
        res.status(400).json({ message: "sessionTitle,division, groups, startDate,and endDate are required" });
        return;
    }
    const availableDivisions = await divisionGroupModel_1.default.distinct('division');
    if (!availableDivisions.includes(division)) {
        res.status(400).json({ message: `${division} is not a valid division` });
        return;
    }
    if (!Array.isArray(sessions) || sessions.length === 0 || sessions.some(session => !session.day || !session.startTime || !session.endTime)) {
        res.status(400).json({ message: "Invalid session format" });
        return;
    }
    const topRoles = ["President", "Vice President"];
    const divisionPresidents = {};
    availableDivisions.forEach((division) => {
        divisionPresidents[`${division} President`] = division;
    });
    const sessionExists = await sessionsModel_1.default.findOne({ sessionTitle });
    if (sessionExists) {
        res.status(400).json({ message: `${sessionTitle} already exist` });
        return;
    }
    const formattedStartDate = (0, dayjs_1.default)(startDate).format("YY/MM/DD");
    const formattedEndDate = (0, dayjs_1.default)(endDate).format("YY/MM/DD");
    if (topRoles.includes(clubRole) || divisionPresidents[clubRole] === division) {
        try {
            const newSession = await sessionsModel_1.default.create({
                sessionTitle,
                division,
                groups,
                startDate: formattedStartDate,
                endDate: formattedEndDate,
                sessions
            });
            res.status(201).json({ message: "New session created", session: newSession });
        }
        catch (error) {
            console.error("Error creating session:", error);
            res.status(500).json({ message: "Failed to create session", error });
        }
    }
    else {
        res.status(403).json({ message: `${clubRole} cannot create a session in ${division} division` });
    }
};
exports.createSession = createSession;
const getSessions = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const [sessions, total] = await Promise.all([
            sessionsModel_1.default.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
            sessionsModel_1.default.countDocuments()
        ]);
        res.status(200).json({
            page,
            totalPages: Math.ceil(total / limit),
            totalSessions: total,
            sessions
        });
    }
    catch (error) {
        console.error("Error fetching sessions:", error);
        res.status(500).json({ message: "Failed to fetch sessions", error });
    }
};
exports.getSessions = getSessions;
const deleteSession = async (req, res) => {
    const { clubRole } = req.user;
    const { id } = req.params;
    if (clubRole === "Member") {
        res.status(403).json({ message: `${clubRole} cannot delete a session` });
        return;
    }
    const session = await sessionsModel_1.default.findById(id);
    if (!session) {
        res.status(404).json({ message: "Session not found" });
        return;
    }
    const availableDivisions = await divisionGroupModel_1.default.distinct('division');
    const topRoles = ["President", "Vice President"];
    const divisionPresidents = {};
    availableDivisions.forEach((division) => {
        divisionPresidents[`${division} President`] = division;
    });
    if (topRoles.includes(clubRole) || divisionPresidents[clubRole] === session.division) {
        try {
            const deletedSession = await session.deleteOne();
            res.status(200).json({ message: "Session deleted successfully", deletedSession });
        }
        catch (error) {
            res.status(500).json({ message: "Error deleting session", error });
        }
    }
    else {
        res.status(403).json({ message: "You are not authorized to delete this session" });
    }
};
exports.deleteSession = deleteSession;
const updateSession = async (req, res) => {
    const { id } = req.params;
    const { clubRole } = req.user;
    const updatedData = req.body;
    try {
        const session = await sessionsModel_1.default.findById(id);
        if (!session) {
            res.status(404).json({ message: "Session not found" });
            return;
        }
        const availableDivisions = await divisionGroupModel_1.default.distinct('division');
        const topRoles = ["President", "Vice President"];
        const divisionPresidents = {};
        availableDivisions.forEach((division) => {
            divisionPresidents[`${division} President`] = division;
        });
        if (topRoles.includes(clubRole) || divisionPresidents[clubRole] === session.division) {
            const updatedSession = await sessionsModel_1.default.findByIdAndUpdate(id, updatedData, { new: true });
            res.status(200).json({ message: "Session updated successfully", updatedSession });
        }
        else {
            res.status(403).json({ message: "You are not authorized to update this session" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Error updating session", error });
    }
};
exports.updateSession = updateSession;
