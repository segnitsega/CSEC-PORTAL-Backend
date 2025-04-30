import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import Member from '../models/membersModel';

export const validateAddPermissions = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const rawRoles: string[] = await Member.distinct('clubRole');
  const lowerRoles = rawRoles.map(r => r.toLowerCase());

  const schema = z.object({
    role: z
      .string()
      .transform(r => r.toLowerCase().trim())
      .refine(r => lowerRoles.includes(r), {
        message: `role must be one of: ${lowerRoles.join(', ')}`,
      }),
    permissions: z
      .array(z.string().transform(p => p.toLowerCase().trim()))
      .min(1, { message: 'permissions array must have at least one entry' }),
    permissionStatus: z
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
    return
  }

  req.body = {
    ...req.body,
    role: result.data.role,
    permissions: result.data.permissions,
    permissionStatus: result.data.permissionStatus,
  };

  next();
};

