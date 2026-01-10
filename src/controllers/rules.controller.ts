import { Request, Response } from "express";
import { ruleService } from "../services/rule.service";
import { handleServiceError } from "../errors/ServiceError";

export const getRules = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await ruleService.getRules();
    res.json(result);
  } catch (err) {
    if (handleServiceError(res, err)) return;
    res.status(500).json({ message: "Error fetching rules" });
  }
};

export const addRules = async (req: Request | any, res: Response): Promise<void> => {
  try {
    const result = await ruleService.addRules(req.user.clubRole, req.body);
    res.json(result);
  } catch (err) {
    if (handleServiceError(res, err)) return;
    res.status(500).json({ message: "Error updating rules" });
  }
};
