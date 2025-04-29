"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const resourceSchema = new mongoose_1.Schema({
    resourceName: { type: String, required: true },
    resourceLink: { type: String, required: true },
    division: { type: String, required: true },
});
exports.default = (0, mongoose_1.model)("Resource", resourceSchema);
