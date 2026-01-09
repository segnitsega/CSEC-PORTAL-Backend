import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { getDivisions } from '../utils/divisionCache';
import Session from '../models/sessionsModel';

const sessionSchema = z.object({
  sessionTitle: z.string().min(5, 'sessionTitle is required and must be at least 5 characters'),
  division:     z.string().min(1, 'division is required'),
  groups:       z.array(z.string().min(1, 'group name cannot be empty'))
                   .nonempty('at least one group is required'),
  startDate:    z.string().min(1, 'startDate is required'),
  endDate:      z.string().min(1, 'endDate is required'),
  sessions:     z
    .array(
      z.object({
        day:       z.string().min(1, 'day is required'),
        startTime: z.string().min(1, 'startTime is required'),
        endTime:   z.string().min(1, 'endTime is required'),
      })
    )
    .nonempty('you must provide at least one session'),
});

export const validateSessionInput = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const parseResult = sessionSchema.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({
      message: 'Validation failed',
      errors: parseResult.error.flatten().fieldErrors,
    });
    return
  }

  const {
    sessionTitle,
    division,
    sessions,
  } = parseResult.data;

  const availableDivisions = await getDivisions();
  if (!availableDivisions.includes(division)) {
    res.status(400).json({
      message: `Division "${division}" is not valid`,
    });
    return
  }

  const existing = await Session.findOne({ sessionTitle });
  if (existing) {
    res.status(400).json({
      message: `Session title "${sessionTitle}" already exists`,
    });
    return
  }

  req.body = parseResult.data;

  next();
};
