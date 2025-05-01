import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

const emailListSchema = z.object({
  emails: z.array(z.string().email()).min(1)
});

export const validateEmailList = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = emailListSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ message: 'Invalid email list', errors: result.error.format() });
    return
  }
  next();
};
