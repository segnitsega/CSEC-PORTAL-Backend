"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPermissions = exports.addNewRole = void 0;
const membersModel_1 = __importDefault(require("../models/membersModel"));
const dynamicDivisionModel_1 = require("../models/dynamicDivisionModel");
const addNewRole = async (req, res) => {
    const { clubRole } = req.user;
    const topRoles = ["President", "Vice President"];
    if (!topRoles.includes(clubRole)) {
        res.status(401).json({ message: `${clubRole} can not assign new role` });
        return;
    }
    const { division, name, email, role } = req.body;
    const memberExists = await membersModel_1.default.findOne({ email });
    if (!memberExists) {
        res.status(400).json({ message: `Invalid email, member with email ${email} does not exist` });
        return;
    }
    try {
        //Demote the current head of the division, because a division can't have duplicate heads
        await membersModel_1.default.findOneAndUpdate({ clubRole: division + " " + "President" }, { $set: { clubRole: "Member" } });
        //assign a new head
        await membersModel_1.default.findOneAndUpdate({ email }, { $set: { clubRole: division + " " + "President" } });
        // change the division head name in the division model
        const Division = await (0, dynamicDivisionModel_1.getDivisionModel)(division);
        console.log(`Division model is: ${Division}`);
        await Division.findOneAndUpdate({ name: division }, { $set: { divisionHead: name } });
        res.status(200).json({
            message: `${name} has been successfully assigned as ${division} President.`,
        });
    }
    catch (error) {
        console.error("Error assigning new role:", error);
        res.status(500).json({
            message: "Unable to assign new role.",
            error: error,
        });
    }
};
exports.addNewRole = addNewRole;
const addPermissions = async (req, res) => {
    const { clubRole } = req.user;
    const topRoles = ["President", "Vice President"];
    if (!topRoles.includes(clubRole)) {
        res.status(401).json({ message: `${clubRole} can not add permissions` });
        return;
    }
    const { role, permissions, permissionStatus } = req.body;
    try {
        await membersModel_1.default.findOneAndUpdate({ clubRole: role }, {
            $set: {
                permissions: permissions,
                permissionStatus: permissionStatus,
            },
        }, { new: true, collation: { locale: "en", strength: 2 } });
        res.status(200).json({
            message: `Permissions updated for ${role}.`,
            permissions: permissions,
            permissionStatus: permissionStatus,
        });
    }
    catch (err) {
        console.error("Error updating permissions:", err);
        res.status(500).json({
            message: "Failed to update permissions.",
            error: err instanceof Error ? err.message : err,
        });
    }
};
exports.addPermissions = addPermissions;
