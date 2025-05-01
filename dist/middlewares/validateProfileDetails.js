"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateProfileDetails = void 0;
const zod_1 = require("zod");
const phoneRegex = /^(?:\+2519\d{8}|\+2517\d{8}|0[79]\d{8})$/;
const validateProfileDetails = async (req, res, next) => {
    try {
        // Parse `resources` if it's a string
        if (req.body.resources && typeof req.body.resources === 'string') {
            try {
                req.body.resources = JSON.parse(req.body.resources);
            }
            catch (_a) {
                res.status(400).json({
                    message: "Invalid JSON format in 'resources'",
                });
                return;
            }
        }
        const requiredDetailSchema = zod_1.z.object({
            firstName: zod_1.z.string().min(3, "First name should be at least 3 characters"),
            lastName: zod_1.z.string().min(3, "Last name should be at least 3 characters"),
            phoneNumber: zod_1.z.string().regex(phoneRegex, "Invalid phone number format"),
            email: zod_1.z.string().email(),
            birthDate: zod_1.z.string(),
            github: zod_1.z.string(),
            gender: zod_1.z.string(),
            telegramHandle: zod_1.z.string(),
            graduationYear: zod_1.z.coerce.number(),
            specialization: zod_1.z.string(),
            department: zod_1.z.string(),
            mentor: zod_1.z.string(),
            universityId: zod_1.z.string().optional(),
            instagramHandle: zod_1.z.string().optional(),
            linkedinHandle: zod_1.z.string().optional(),
            codeforcesHandle: zod_1.z.string().optional(),
            cv: zod_1.z.string().optional(),
            leetcodeHandle: zod_1.z.string().optional(),
            bio: zod_1.z.string().optional(),
            resources: zod_1.z
                .array(zod_1.z.object({
                resourceName: zod_1.z.string().min(1, "Resource name is required"),
                resourceLink: zod_1.z.string().url("Invalid resource link URL"),
            }))
                .optional(),
        });
        const result = requiredDetailSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({
                message: "Validation failed",
                errors: result.error.flatten().fieldErrors,
            });
            return;
        }
        req.body = result.data;
        next();
    }
    catch (error) {
        console.error("Error fetching divisions:", error);
        res.status(500).json({
            message: "Internal server error during validation",
        });
    }
};
exports.validateProfileDetails = validateProfileDetails;
