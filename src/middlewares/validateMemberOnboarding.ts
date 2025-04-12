
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const validDivisions = ["DEV", "CPD", "DS", "SEC", "CBD"] as const;
const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

const onboardingSchema = z.object({
  division: z.enum( validDivisions, {
    errorMap: () => ({ message: 'Division must be one of DEV, CPD, DS, SEC, or CBD.' })
  } ),
  group: z.number({ required_error: 'Group is required.' }),
  email: z.string().email('Invalid email format.'),
  generatedPassword: z.string().regex(strongPasswordRegex, {
    message: 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.'
  })
});

export const validateMemberOnboarding = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const result = onboardingSchema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message
    }));
    res.status(400).json({ errors });
    return;
  }

  next();
};

