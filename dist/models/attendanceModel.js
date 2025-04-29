"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const attendanceSchema = new mongoose_1.Schema({
    memberId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Member", required: true },
    sessionId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Session", required: true },
    status: {
        type: String,
        enum: ["Present", "Absent", "Excused"],
        required: true,
    },
    headsUp: { type: String },
    date: { type: Date, default: Date.now },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Attendance", attendanceSchema);
