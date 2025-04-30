"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addNewRole = void 0;
const membersModel_1 = __importDefault(require("../models/membersModel"));
const dynamicDivisionModel_1 = require("../models/dynamicDivisionModel");
const addNewRole = async (req, res) => {
    if (Object.keys(req.body).length === 0) {
        res.status(400).json({ message: "request body is empty" });
        return;
    }
    try {
        const { division, name, email, role } = req.body;
        console.log(division, name, email, role);
        // change the division head name on the division collection
        const Division = await (0, dynamicDivisionModel_1.getDivisionModel)(division);
        if (!division) {
            res.status(401).json({ message: "Divison not found" });
            return;
        }
        const changed = await Division.updateOne({ name: division }, { $set: { divisionHead: name }, new: true });
        //change the existing head role to member
        const changed1 = await membersModel_1.default.findOneAndUpdate({ clubRole: role }, { $set: { clubRole: "Member" }, new: true });
        console.log(changed1);
        // change the new member to head
        await membersModel_1.default.updateOne({ email: email }, { $set: { clubRole: role } });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Unable to assign new role", error: error });
    }
};
exports.addNewRole = addNewRole;
