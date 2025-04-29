"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const divisionGroupSchema = new mongoose_1.Schema({
    groups: { type: [String], default: ["Group 1"] },
    division: {
        type: String,
        unique: true,
        required: true
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('DivisionGroup', divisionGroupSchema);
