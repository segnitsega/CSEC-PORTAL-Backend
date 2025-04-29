"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDivision = exports.getGroups = exports.getAllDivisions = void 0;
const divisionGroupModel_1 = __importDefault(require("../models/divisionGroupModel"));
const membersModel_1 = __importDefault(require("../models/membersModel"));
const dynamicDivisionModel_1 = require("../models/dynamicDivisionModel");
const getAllDivisions = async (req, res) => {
    try {
        const divisions = await divisionGroupModel_1.default.distinct('division');
        res.status(200).json({ length: divisions.length, divisions: divisions });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to get divisions", error: error });
    }
};
exports.getAllDivisions = getAllDivisions;
const getGroups = async (req, res) => {
    const division = req.params.division;
    try {
        const availableDivisions = await divisionGroupModel_1.default.distinct('division');
        if (!availableDivisions.includes(division)) {
            res.status(400).json({ message: "Invalid division" });
            return;
        }
        const divisionDocument = await divisionGroupModel_1.default.findOne({ division }).select('groups');
        if (divisionDocument) {
            res.status(200).json({
                length: divisionDocument.groups.length,
                groups: divisionDocument.groups
            });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Failed to get groups", error: error });
    }
};
exports.getGroups = getGroups;
const createDivision = async (req, res) => {
    const { divisionName, headName, email } = req.body;
    const { clubRole } = req.user;
    const allowedRoles = ["President", "Vice President"];
    if (!divisionName || !email || !headName) {
        res.status(403).json({ message: "divisionName, headName and email required" });
        return;
    }
    if (!allowedRoles.includes(clubRole)) {
        res.status(403).json({ message: `${clubRole} can not add a division` });
        return;
    }
    try {
        const divisionExists = await divisionGroupModel_1.default.findOne({ division: divisionName });
        if (divisionExists) {
            res.status(400).json({ message: `division "${divisionName}" already exist` });
            return;
        }
        const memberExists = await membersModel_1.default.findOne({ email });
        if (!memberExists) {
            res.status(400).json({ message: `Invalid email, member with email ${email} does not exist` });
            return;
        }
        const newDivision = await divisionGroupModel_1.default.create({ division: divisionName }); // creates a new division
        await membersModel_1.default.findOneAndUpdate({ email }, { $set: { clubRole: divisionName + " " + "President" } }); // update the head's role to the created division's president
        const Division = await (0, dynamicDivisionModel_1.getDivisionModel)(divisionName); // get the divisionModel to create the new division's collection dynamically
        const existingDivisionDoc = await Division.findOne({ name: divisionName });
        if (!existingDivisionDoc) {
            await Division.create({ name: divisionName, divisionHead: headName }); // if division does not exist, it creates a new division collection
        }
        res.status(201).json({ message: "Division created successfully", division: newDivision });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to create division", error: error });
    }
};
exports.createDivision = createDivision;
