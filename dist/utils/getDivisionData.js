"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDivisionData = void 0;
const dynamicDivisionModel_1 = require("../models/dynamicDivisionModel");
const getDivisionData = async (member) => {
    const DivisionModel = (0, dynamicDivisionModel_1.getDivisionModel)(member.division);
    return await DivisionModel.find({ member: member._id });
};
exports.getDivisionData = getDivisionData;
