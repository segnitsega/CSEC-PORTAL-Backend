"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateResource = exports.deleteResource = exports.getResources = exports.addResource = void 0;
const resourcesModel_1 = __importDefault(require("../models/resourcesModel"));
const divisionGroupModel_1 = __importDefault(require("../models/divisionGroupModel"));
const addResource = async (req, res) => {
    const { clubRole } = req.user;
    if (clubRole === "Member") {
        res.status(403).json({ message: "Unauthorized to add resources" });
        return;
    }
    const { resourceName, resourceLink, division } = req.body;
    if (!resourceName || !resourceLink || !division) {
        res.status(400).json({ message: "resourceName, resourceLink, and division are required" });
        return;
    }
    const availableDivisions = await divisionGroupModel_1.default.distinct('division');
    if (!availableDivisions.includes(division)) {
        res.status(400).json({ message: `${division} is not a valid division` });
        return;
    }
    const resourceExists = await resourcesModel_1.default.findOne({ resourceName, division });
    if (resourceExists) {
        res.status(400).json({ message: `${resourceName} already exists in ${division}` });
        return;
    }
    const topRoles = ["President", "Vice President"];
    const divisionPresidents = {};
    availableDivisions.forEach((division) => {
        divisionPresidents[`${division} President`] = division;
    });
    if (topRoles.includes(clubRole) || divisionPresidents[clubRole] === division) {
        try {
            const newResource = await resourcesModel_1.default.create({
                resourceName,
                resourceLink,
                division
            });
            res.status(201).json({ message: "New resource added successfully", Resource: newResource });
            return;
        }
        catch (error) {
            console.error("Error adding resource:", error);
            res.status(500).json({ message: "Failed to add resources", error });
            return;
        }
    }
    else {
        res.status(403).json({ message: `${clubRole} can not add resource in ${division} division` });
    }
};
exports.addResource = addResource;
const getResources = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const [resources, total] = await Promise.all([
            resourcesModel_1.default.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
            resourcesModel_1.default.countDocuments()
        ]);
        // const resources = await Resource.find()
        if (resources.length === 0) {
            res.status(200).json({ message: "No resources available", Resources: [] });
            return;
        }
        res.status(200).json({
            page,
            totalPages: Math.ceil(total / limit),
            totalResources: total,
            Resources: resources
        });
    }
    catch (err) {
        res.status(500).json({ message: "unable to get resources", error: err });
    }
};
exports.getResources = getResources;
const deleteResource = async (req, res) => {
    const { clubRole } = req.user;
    if (clubRole === "Member") {
        res.status(403).json({ message: `${clubRole} cannot delete a resource` });
        return;
    }
    const { id } = req.params;
    const resource = await resourcesModel_1.default.findById(id);
    const availableDivisions = await divisionGroupModel_1.default.distinct('division');
    const topRoles = ["President", "Vice President"];
    const divisionPresidents = {};
    availableDivisions.forEach((division) => {
        divisionPresidents[`${division} President`] = division;
    });
    if (topRoles.includes(clubRole) || divisionPresidents[clubRole] === (resource === null || resource === void 0 ? void 0 : resource.division)) {
        try {
            const deletedResource = await resourcesModel_1.default.findByIdAndDelete(id);
            if (!deletedResource) {
                res.status(404).json({ message: "Resource not found" });
                return;
            }
            res.status(200).json({ message: "Resource deleted successfully" });
        }
        catch (error) {
            res.status(500).json({ message: "Error deleting resource", error });
        }
    }
    else {
        res.status(403).json({ message: "Unauthorized to delete this resource" });
    }
};
exports.deleteResource = deleteResource;
const updateResource = async (req, res) => {
    const { clubRole } = req.user;
    if (clubRole === "Member") {
        res.status(403).json({ message: `${clubRole} cannot update a resource` });
        return;
    }
    const { id } = req.params;
    const updatedData = req.body;
    const resource = await resourcesModel_1.default.findById(id);
    const availableDivisions = await divisionGroupModel_1.default.distinct('division');
    const topRoles = ["President", "Vice President"];
    const divisionPresidents = {};
    availableDivisions.forEach((division) => {
        divisionPresidents[`${division} President`] = division;
    });
    if (topRoles.includes(clubRole) || divisionPresidents[clubRole] === (resource === null || resource === void 0 ? void 0 : resource.division)) {
        try {
            const updatedResource = await resourcesModel_1.default.findByIdAndUpdate(id, updatedData, { new: true });
            if (!updatedResource) {
                res.status(404).json({ message: "Resource not found" });
                return;
            }
            res.status(200).json({ message: "Resource updated successfully", updatedResource });
        }
        catch (error) {
            res.status(500).json({ message: "Error updating resource", error });
        }
    }
    else {
        res.status(403).json({ message: "Unauthorized to update this resource" });
    }
};
exports.updateResource = updateResource;
