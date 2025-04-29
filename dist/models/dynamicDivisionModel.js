"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDivisionModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const divisionGroupModel_1 = __importDefault(require("./divisionGroupModel"));
const divisionSchema = new mongoose_1.default.Schema({
    name: String,
    divisionHead: String,
    createdAt: { type: Date, default: Date.now },
});
const getDivisionModel = async (divisionName) => {
    const modelName = divisionName.toLowerCase().replace(/\s+/g, '') + 'Model';
    const validDivision = await divisionGroupModel_1.default.findOne({ division: divisionName });
    if (!validDivision) {
        throw new Error(`Division "${divisionName}" is not valid.`);
    }
    return mongoose_1.default.models[modelName] || mongoose_1.default.model(modelName, divisionSchema, divisionName.toLowerCase().replace(/\s+/g, '_'));
};
exports.getDivisionModel = getDivisionModel;
