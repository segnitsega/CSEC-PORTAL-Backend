
import { z } from "zod";
import { Request, Response, NextFunction } from "express";

const phoneRegex = /^(?:\+2519\d{8}|\+2517\d{8}|0[79]\d{8})$/;

export const validateProfileDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const requiredDetailSchema = z.object({
      firstName: z.string().min(3, "First name should be at least 3 characters"),
      lastName: z.string().min(3, "Last name should be at least 3 characters"),
      phoneNumber: z.string().regex(phoneRegex, "Invalid phone number format"),
      email: z.string().email(),
      birthDate: z.string(),
      github: z.string(),
      gender: z.string(),
      telegramHandle: z.string(),
      graduationYear: z.coerce.number(),
      specialization: z.string(),
      department: z.string(),
      mentor: z.string(),
      universityId: z.string().optional(),
      instagramHandle: z.string().optional(),
      linkedinHandle: z.string().optional(),
      codeforcesHandle: z.string().optional(),
      cv: z.string().optional(),
      leetcodeHandle: z.string().optional(),
      bio: z.string().optional(),
      
    });

    const result = requiredDetailSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        message: "Validation failed",
        errors: result.error.flatten().fieldErrors,
      })
      return
    }

    req.body = result.data;
    next();
  } catch (error) {
    console.error("Error fetching divisions:", error);
    res.status(500).json({
      message: "Internal server error during validation",
    });
  }
};


