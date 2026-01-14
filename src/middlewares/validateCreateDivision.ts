import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import Member from '../models/membersModel';
import DivisionGroup from '../models/divisionGroupModel';

const createDivisionSchema = z.object({
  divisionName: z.string().min(5, 'divisionName is required'),
  // headName: z.string().min(5, 'headName is required'),
  // email: z.string().email('Invalid email format'),
});

export const validateCreateDivision = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {

  const parseResult = createDivisionSchema.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({
      message: 'Validation failed',
      errors: parseResult.error.format(),
    });
    return
  }
  // const { divisionName, headName, email } = parseResult.data;
  const { divisionName } = parseResult.data;

  const divisionExists = await DivisionGroup.findOne({ division: divisionName });
  if (divisionExists) {
    res.status(400)
      .json({ message: `Division "${divisionName}" already exists` });
    return
  }

  // const member = await Member.findOne({ email });
  // if (!member) {
  //   res.status(400)
  //     .json({ message: `No member found with email "${email}"` });
  //   return
  // }

  req.body = {
    divisionName: divisionName,
    // headName: headName,
    // email: email,
  };

  next();
};
