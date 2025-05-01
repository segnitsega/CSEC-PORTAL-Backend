"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAddPermissions = void 0;
const zod_1 = require("zod");
const membersModel_1 = __importDefault(require("../models/membersModel"));
const validateAddPermissions = async (req, res, next) => {
    const rawRoles = await membersModel_1.default.distinct('clubRole');
    const lowerRoles = rawRoles.map(r => r.toLowerCase());
    const schema = zod_1.z.object({
        role: zod_1.z
            .string()
            .transform(r => r.toLowerCase().trim())
            .refine(r => lowerRoles.includes(r), {
            message: `role must be one of: ${lowerRoles.join(', ')}`,
        }),
        permissions: zod_1.z
            .array(zod_1.z.string().transform(p => p.toLowerCase().trim()))
            .min(1, { message: 'permissions array must have at least one entry' }),
        permissionStatus: zod_1.z
            .string()
            .transform(s => s.toLowerCase().trim())
            .refine(s => ['active', 'inactive'].includes(s), {
            message: `permissionStatus must be "active" or "inactive"`,
        }),
    });
    const result = schema.safeParse({
        role: req.body.role,
        permissions: req.body.permissions,
        permissionStatus: req.body.permissionStatus,
    });
    if (!result.success) {
        res.status(400).json({
            message: 'Invalid addPermissions payload',
            errors: result.error.format(),
        });
        return;
    }
    req.body = Object.assign(Object.assign({}, req.body), { role: result.data.role, permissions: result.data.permissions, permissionStatus: result.data.permissionStatus });
    next();
};
exports.validateAddPermissions = validateAddPermissions;
