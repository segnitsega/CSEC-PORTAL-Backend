import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { getDivisions } from '../utils/divisionCache';

const strongPasswordRegex =/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

export const validateMemberOnboarding = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

  try {  
    const validDivisions = await getDivisions();
    const onboardingSchema = z.object({
      firstName: z.string({ required_error: 'First name is required.' })
        .min(2, 'First name must be at least 2 characters long.')
        .max(50, 'First name must be at most 50 characters long.'),
        
      lastName: z.string({ required_error: 'Last name is required.' })
        .min(2, 'Last name must be at least 2 characters long.')
        .max(50, 'Last name must be at most 50 characters long.'),
      division: z.string().refine((val) => validDivisions.includes(val), {
        message: `Division must be one of ${validDivisions}`,
      }), 
      group: z.string({ required_error: 'Group is required.' }),
      email: z.string().email('Invalid email format.'),
      generatedPassword: z.string().regex(strongPasswordRegex, {
        message:
          'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.',
      }),
    });
    const result = onboardingSchema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      res.status(400).json({ errors });
      return;
    }

    next();
  } catch (err) {
    console.error('Validation middleware error:', err);
    res.status(500).json({ message: 'Server error during validation.' });
  }
};
