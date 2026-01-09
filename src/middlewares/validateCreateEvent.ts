import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { getDivisions } from '../utils/divisionCache';
import Event from '../models/eventsModel';

const addEventSchema = z.object({
  eventTitle: z.string().min(5, 'eventTitle must be at least 5 characters'),
  eventDate:  z.string().min(1, 'eventDate is required'),
  startTime:  z.string().min(1, 'startTime is required'),
  endTime:    z.string().min(1, 'endTime is required'),
  visibility: z.string().min(1, 'visibility is required'),
  attendance: z.string().optional(),
  division:   z.string().min(1, 'division cannot be empty').optional(),
  groups:     z.array(z.string().min(1, 'group name cannot be empty')).optional(),
});

export const validateCreateEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const parseResult = addEventSchema.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({
      message: 'Validation failed',
      errors: parseResult.error.flatten().fieldErrors,
    });
    return
  }
  const data = parseResult.data;

  if (data.division) {
    if (!data.groups || data.groups.length === 0) {
      res.status(400).json({
        message: 'If division is specified, at least one group is required',
      });
      return
    }

    const available = await getDivisions();
    if (!available.includes(data.division)) {
      res.status(400).json({
        message: `Division "${data.division}" is not a valid division`,
      });
      return
    }
  }

  const exists = await Event.findOne({ eventTitle: data.eventTitle });
  if (exists) {
    res.status(400).json({
      message: `Event "${data.eventTitle}" already exists`,
    });
    return
  }
  req.body = data;
  next();
};
