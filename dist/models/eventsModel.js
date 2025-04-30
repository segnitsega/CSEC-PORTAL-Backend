"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const eventSchema = new mongoose_1.Schema({
    eventTitle: { type: String, required: true },
    division: { type: String },
    groups: { type: [String], default: undefined },
    eventDate: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    visibility: { type: String, required: true },
    attendance: { type: String, default: "Optional" }
});
exports.default = (0, mongoose_1.model)('Event', eventSchema);
