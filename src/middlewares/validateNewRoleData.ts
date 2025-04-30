import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import Member from '../models/membersModel';
import DivisionGroup from '../models/divisionGroupModel';

export const validateAddNewRole = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { division, name, email, role } = req.body;

  const schema = z.object({
    division: z.string().min(1, { message: "division is required" }),
    name: z.string().min(1, { message: "name is required" }),
    email: z.string().email({ message: "invalid email format" }),
    role: z.string().min(1, { message: "role is required" }),
  });

  const result = schema.safeParse({ division, name, email, role });

  if (!result.success) {
    res.status(400).json({
      message: 'Invalid addNewRole payload',
      errors: result.error.format(),
    });
    return;
  }

  // Check if division exists
  const divisionExists = await DivisionGroup.findOne({ division: result.data.division });
  if (!divisionExists) {
    res.status(400).json({ message: `division "${result.data.division}" does not exist` });
    return;
  }

  // Check if member exists
  const memberExists = await Member.findOne({ email: result.data.email });
  if (!memberExists) {
    res.status(400).json({ message: `Invalid email, member with email ${result.data.email} does not exist` });
    return;
  }

  // Attach cleaned data to req.body
  req.body = {
    division: result.data.division.trim(),
    name: result.data.name.trim(),
    email: result.data.email.trim().toLowerCase(),
    role: result.data.role.trim(),
  };

  next();
};
