"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateMemberOnboarding = void 0;
const zod_1 = require("zod");
const divisionGroupModel_1 = __importDefault(require("../models/divisionGroupModel"));
const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
const validateMemberOnboarding = async (req, res, next) => {
    try {
        const validDivisions = await divisionGroupModel_1.default.distinct('division');
        const onboardingSchema = zod_1.z.object({
            firstName: zod_1.z.string({ required_error: 'First name is required.' })
                .min(2, 'First name must be at least 2 characters long.')
                .max(50, 'First name must be at most 50 characters long.'),
            lastName: zod_1.z.string({ required_error: 'Last name is required.' })
                .min(2, 'Last name must be at least 2 characters long.')
                .max(50, 'Last name must be at most 50 characters long.'),
            division: zod_1.z.string().refine((val) => validDivisions.includes(val), {
                message: `Division must be one of ${validDivisions}`,
            }),
            group: zod_1.z.string({ required_error: 'Group is required.' }),
            email: zod_1.z.string().email('Invalid email format.'),
            generatedPassword: zod_1.z.string().regex(strongPasswordRegex, {
                message: 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.',
            }),
        });
        const result = onboardingSchema.safeParse(req.body);
        if (!result.success) {
            const errors = result.error.errors.map((err) => ({
                field: err.path.join('.'),
                message: err.message,
            }));
            res.status(400).json({ errors });
            return;
        }
        next();
    }
    catch (err) {
        console.error('Validation middleware error:', err);
        res.status(500).json({ message: 'Server error during validation.' });
    }
};
exports.validateMemberOnboarding = validateMemberOnboarding;
