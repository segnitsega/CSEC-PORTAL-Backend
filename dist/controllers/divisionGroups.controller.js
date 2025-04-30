"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGroupMembers = exports.createGroup = void 0;
const divisionGroupModel_1 = __importDefault(require("../models/divisionGroupModel"));
const membersModel_1 = __importDefault(require("../models/membersModel"));
const createGroup = async (req, res) => {
    const { clubRole } = req.user;
    if (clubRole === "Member") {
        res.status(403).json({ message: "Unauthorized to create a group" });
        return;
    }
    const { group, division } = req.body;
    if (!group || !division) {
        res.status(400).json({ message: "Group name and division required" });
        return;
    }
    const availableDivisions = await divisionGroupModel_1.default.distinct('division');
    if (!availableDivisions.includes(division)) {
        res.status(400).json({ message: `${division} is not a valid division` });
        return;
    }
    const groupExist = await divisionGroupModel_1.default.findOne({ division, groups: group });
    if (groupExist) {
        res.status(400).json({ message: `${group} exists in ${division}` });
        return;
    }
    const topRoles = ["President", "Vice President"];
    const divisionPresidents = {};
    availableDivisions.forEach((division) => {
        divisionPresidents[`${division} President`] = division;
    });
    if (topRoles.includes(clubRole) || divisionPresidents[clubRole] === division) {
        try {
            const newGroup = await divisionGroupModel_1.default.updateOne({ division }, { $addToSet: { groups: group } });
            res.status(201).json({ message: "New group created", group: newGroup });
        }
        catch (error) {
            console.error("Error creating group:", error);
            res.status(500).json({ message: "Failed to create group", error });
        }
    }
    else {
        res.status(403).json({ message: `${clubRole} cannot create a group in ${division} division` });
    }
};
exports.createGroup = createGroup;
const getGroupMembers = async (req, res) => {
    const division = req.query.division;
    const group = req.query.group;
    if (!group || !division) {
        res.status(400).json({ message: "Group name and division required" });
        return;
    }
    const groupExist = await divisionGroupModel_1.default.findOne({ groups: group, division });
    if (!groupExist) {
        res.status(400).json({ message: `Group "${group}" does not exist in ${division}` });
        return;
    }
    try {
        const groupMembers = await membersModel_1.default.find({ division, group }).select("-password -refreshToken");
        if (groupMembers.length === 0) {
            res.status(404).json({ message: "No members found in this group" });
            return;
        }
        res.status(200).json({
            message: "Members retrieved",
            length: groupMembers.length,
            groupMembers: groupMembers
        });
    }
    catch (error) {
        console.error("Error fetching group members:", error);
        res.status(500).json({ message: "Failed to fetch members", error });
    }
};
exports.getGroupMembers = getGroupMembers;
