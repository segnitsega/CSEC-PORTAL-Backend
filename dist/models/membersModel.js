"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const memberSchema = new mongoose_1.Schema({
    universityId: { type: String },
    firstName: { type: String, trim: true },
    middleName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    email: { type: String, unique: true, lowercase: true, trim: true, sparse: true },
    banned: { type: Boolean, default: false },
    telegramHandle: { type: String, trim: true },
    instagramHandle: { type: String, trim: true },
    linkedinHandle: { type: String, trim: true },
    phoneNumber: { type: String, trim: true },
    bio: { type: String },
    department: { type: String },
    mentor: { type: String },
    specialization: { type: String },
    github: { type: String },
    leetcodeHandle: { type: String },
    codeforcesHandle: { type: String },
    // resourceName: { type: String },
    // resourceLink: { type: String },
    birthDate: { type: String },
    graduationYear: { type: Number },
    cv: { type: String },
    profilePicture: { type: String },
    clubRole: {
        type: String,
        default: 'Member'
    },
    permissions: { type: [String], default: [] },
    permissionStatus: {
        type: String,
        enum: ["active", "inactive"]
    },
    resources: [{
            resourceName: { type: String },
            resourceLink: { type: String }
        }],
    division: {
        type: String,
        required: true,
    },
    group: { type: String, default: "Group 1" },
    divisionRole: {
        type: String,
        enum: ['Admin', 'Coordinator', 'Member'],
        default: 'Member'
    },
    membershipStatus: {
        type: String,
        enum: ['Active', 'Alumni', 'Banned'],
        default: 'Active'
    },
    campusStatus: {
        type: String,
        enum: ['On Campus', 'Off Campus', 'Withdrawn'],
        default: 'On Campus'
    },
    attendance: {
        type: String,
        enum: ['Active', 'Inactive', 'Needs Attention'],
        default: 'Active'
    },
    password: { type: String },
    mustChangePassword: { type: Boolean, default: false },
    refreshToken: { type: String, default: null },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Member', memberSchema);
