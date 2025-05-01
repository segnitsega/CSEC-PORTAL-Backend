"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAddNewRole = void 0;
const zod_1 = require("zod");
const membersModel_1 = __importDefault(require("../models/membersModel"));
const divisionGroupModel_1 = __importDefault(require("../models/divisionGroupModel"));
const validateAddNewRole = async (req, res, next) => {
    const { division, name, email, role } = req.body;
    const schema = zod_1.z.object({
        division: zod_1.z.string().min(1, { message: "division is required" }),
        name: zod_1.z.string().min(1, { message: "name is required" }),
        email: zod_1.z.string().email({ message: "invalid email format" }),
        role: zod_1.z.string().min(1, { message: "role is required" }),
    });
    const result = schema.safeParse({ division, name, email, role });
    if (!result.success) {
        res.status(400).json({
            message: 'Invalid addNewRole payload',
            errors: result.error.format(),
        });
        return;
    }
    // Check if division exists
    const divisionExists = await divisionGroupModel_1.default.findOne({ division: result.data.division });
    if (!divisionExists) {
        res.status(400).json({ message: `division "${result.data.division}" does not exist` });
        return;
    }
    // Check if member exists
    const memberExists = await membersModel_1.default.findOne({ email: result.data.email });
    if (!memberExists) {
        res.status(400).json({ message: `Invalid email, member with email ${result.data.email} does not exist` });
        return;
    }
    // Attach cleaned data to req.body
    req.body = {
        division: result.data.division.trim(),
        name: result.data.name.trim(),
        email: result.data.email.trim().toLowerCase(),
        role: result.data.role.trim(),
    };
    next();
};
exports.validateAddNewRole = validateAddNewRole;
