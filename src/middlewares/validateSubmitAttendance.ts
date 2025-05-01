import { Request, Response, NextFunction } from "express";
import { z } from "zod";

const recordSchema = z.object({
  memberId: z.string().min(1, "memberId is required"),
  status: z.preprocess(
    (val) => (typeof val === "string" ? val.toLowerCase() : val),
    z.enum(["present", "absent", "excused"], {
      errorMap: () => ({ message: "status must be one of present, absent, or excused" }),
    })
  ), 
  headsUp:  z.string().optional(),
});

const attendanceSchema = z.object({
  sessionId: z.string().min(1, "sessionId is required"),
  records:   z.array(recordSchema).nonempty("At least one record is required"),
});

export const validateSubmitAttendance = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const result = attendanceSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({
      message: "Invalid attendance payload",
      errors: result.error.flatten().fieldErrors,
    });
    return
  }
  req.body = result.data;
  next();
};
