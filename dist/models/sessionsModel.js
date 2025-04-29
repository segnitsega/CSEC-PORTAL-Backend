"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const sessionSchema = new mongoose_1.Schema({
    sessionTitle: { type: String, required: true, unique: true },
    division: { type: String, required: true },
    groups: { type: [String], required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    sessions: [
        {
            day: { type: String, required: true },
            startTime: { type: String, required: true },
            endTime: { type: String, required: true }
        }
    ],
    status: { type: String, default: "Planned" }
});
exports.default = (0, mongoose_1.model)('Session', sessionSchema);
