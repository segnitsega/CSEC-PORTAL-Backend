import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { getDivisions } from '../utils/divisionCache';
import Resource from "../models/resourcesModel";


const addResourceSchema = z.object({
  resourceName: z.string().min(5, 'resourceName is required'),
  resourceLink: z.string().url('Invalid URL format for resourceLink'),
  division:     z.string().min(1, 'division is required'),
});

export const validateResource = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const parseResult = addResourceSchema.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({
      message: 'Validation failed',
      errors: parseResult.error.flatten().fieldErrors,
    });
    return
  }

  const { resourceName, resourceLink, division } = parseResult.data;

  const availableDivisions = await getDivisions();
  if (!availableDivisions.includes(division)) {
    res.status(400).json({ message: `${division} is not a valid division` });
    return
  }

  const resourceExists = await Resource.findOne({ resourceName, division });
  if (resourceExists) {
    res
      .status(400)
      .json({ message: `${resourceName} already exists in ${division}` });
      return
  }

  req.body = { resourceName, resourceLink, division };
  next();
};
