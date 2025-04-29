"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEvent = exports.deleteEvent = exports.getEvents = exports.addEvent = void 0;
const eventsModel_1 = __importDefault(require("../models/eventsModel"));
const divisionGroupModel_1 = __importDefault(require("../models/divisionGroupModel"));
const dayjs_1 = __importDefault(require("dayjs"));
const addEvent = async (req, res) => {
    const { clubRole } = req.user;
    if (clubRole === "Member") {
        res.status(403).json({ message: `${clubRole} can not add event` });
        return;
    }
    const { eventTitle, division, groups, eventDate, startTime, endTime, visibility, attendance } = req.body;
    const eventExist = await eventsModel_1.default.findOne({ eventTitle });
    if (eventExist) {
        res.status(400).json({ message: `Event ${eventTitle} already exists` });
        return;
    }
    const formattedDate = (0, dayjs_1.default)(eventDate).format("YY/MM/DD");
    const topRoles = ["President", "Vice President"];
    if (division && groups) {
        const availableDivisions = await divisionGroupModel_1.default.distinct('division');
        if (!availableDivisions.includes(division)) {
            res.status(400).json({ message: `${division} is not a valid division` });
            return;
        }
        const divisionPresidents = {};
        availableDivisions.forEach((division) => {
            divisionPresidents[`${division} President`] = division;
        });
        if (topRoles.includes(clubRole) || divisionPresidents[clubRole] === division) {
            try {
                const newEvent = await eventsModel_1.default.create({
                    eventTitle,
                    division,
                    groups,
                    eventDate: formattedDate,
                    startTime,
                    endTime,
                    visibility,
                    attendance
                });
                res.status(201).json({ message: "New event added", Event: newEvent });
                return;
            }
            catch (error) {
                console.error("Error creating session:", error);
                res.status(500).json({ message: "Failed to add event", error });
                return;
            }
        }
    }
    try {
        const newEvent = await eventsModel_1.default.create({
            eventTitle,
            eventDate: formattedDate,
            startTime,
            endTime,
            visibility
        });
        res.status(201).json({ message: "New event added", Event: newEvent });
        return;
    }
    catch (error) {
        console.error("Error creating session:", error);
        res.status(500).json({ message: "Failed to add event", error });
        return;
    }
};
exports.addEvent = addEvent;
const getEvents = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const [events, total] = await Promise.all([
            eventsModel_1.default.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
            eventsModel_1.default.countDocuments()
        ]);
        res.status(200).json({
            page,
            totalPages: Math.ceil(total / limit),
            totalEvents: total,
            events
        });
    }
    catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ message: "Failed to fetch events", error });
    }
};
exports.getEvents = getEvents;
const deleteEvent = async (req, res) => {
    const { clubRole } = req.user;
    if (clubRole === "Member") {
        res.status(403).json({ message: `${clubRole} cannot delete an event` });
        return;
    }
    const { id } = req.params;
    const event = await eventsModel_1.default.findById(id);
    const availableDivisions = await divisionGroupModel_1.default.distinct('division');
    const topRoles = ["President", "Vice President"];
    const divisionPresidents = {};
    availableDivisions.forEach((division) => {
        divisionPresidents[`${division} President`] = division;
    });
    if (topRoles.includes(clubRole) || divisionPresidents[clubRole] === (event === null || event === void 0 ? void 0 : event.division)) {
        try {
            const deletedEvent = await eventsModel_1.default.findByIdAndDelete(id);
            if (!deletedEvent) {
                res.status(404).json({ message: "Event not found" });
                return;
            }
            res.status(200).json({ message: "Event deleted successfully" });
        }
        catch (error) {
            res.status(500).json({ message: "Error deleting event", error });
        }
    }
    else {
        res.status(403).json({ message: "Unauthorized to delete this event" });
    }
};
exports.deleteEvent = deleteEvent;
const updateEvent = async (req, res) => {
    const { clubRole } = req.user;
    if (clubRole === "Member") {
        res.status(403).json({ message: `${clubRole} cannot update an event` });
        return;
    }
    const { id } = req.params;
    const updatedData = req.body;
    const event = await eventsModel_1.default.findById(id);
    const availableDivisions = await divisionGroupModel_1.default.distinct('division');
    const topRoles = ["President", "Vice President"];
    const divisionPresidents = {};
    availableDivisions.forEach((division) => {
        divisionPresidents[`${division} President`] = division;
    });
    if (topRoles.includes(clubRole) || divisionPresidents[clubRole] === (event === null || event === void 0 ? void 0 : event.division)) {
        try {
            const updatedEvent = await eventsModel_1.default.findByIdAndUpdate(id, updatedData, { new: true });
            if (!updatedEvent) {
                res.status(404).json({ message: "Event not found" });
                return;
            }
            res.status(200).json({ message: "Event updated successfully", updatedEvent });
        }
        catch (error) {
            res.status(500).json({ message: "Error updating event", error });
        }
    }
    else {
        res.status(403).json({ message: "Unauthorized to update this event" });
    }
};
exports.updateEvent = updateEvent;
