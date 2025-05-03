import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export const clubRulesSchema = z.object({
  maxAbsences: z.number().int().nonnegative(),
  warningAfter: z.number().int().nonnegative(),
  suspendAfter: z.number().int().nonnegative(),
  fireAfter: z.number().int().nonnegative(),
}).strict(); 

export const validateClubRules = (req: Request, res: Response, next: NextFunction): void => {
  const result = clubRulesSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      message: "Invalid club rules data",
      errors: result.error.flatten().fieldErrors,
    });
    return
  }

  req.body = result.data;
  next();
};
