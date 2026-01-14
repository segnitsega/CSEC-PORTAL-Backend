import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import DivisionGroup from '../models/divisionGroupModel';
import { getDivisions } from '../utils/divisionCache';

const createDivisionSchema = z.object({
    group: z.string().min(1, 'group name is required'),
    division: z.string().min(1, 'division is required'),
});

export const validateCreateGroup = async (
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
  const { group, division } = parseResult.data;

  const availableDivisions = await getDivisions();
  if(!availableDivisions.includes(division)){
    res.status(400).json({ message: `${division} is not a valid division` });
    return;
}
    const groupExist = await DivisionGroup.findOne({ division, groups: group})  
    if(groupExist){
        res.status(400).json( {message: `${group} exists in ${division}`})     
        return    
    }

  req.body = { division, group };
  next();
};
