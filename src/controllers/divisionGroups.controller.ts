import { Request, Response } from "express";
import { divisionGroupService } from "../services/divisionGroup.service";
import { handleServiceError } from "../errors/ServiceError";
import { AuthenticatedRequest } from "../types/express";

export const createGroup = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { group, division } = req.body;
  try {
    const result = await divisionGroupService.createGroup(req.user!.clubRole, group, division);
    res.status(201).json(result);
  } catch (error) {
    if (handleServiceError(res, error)) return;
    console.error("Error creating group:", error);
    res.status(500).json({ message: "Failed to create group", error });
  }
};

export const getGroupMembers = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await divisionGroupService.getGroupMembers(req.query);
    res.status(200).json(result);
  } catch (error) {
    if (handleServiceError(res, error)) return;
    console.error("Error fetching group members:", error);
    res.status(500).json({ message: "Failed to fetch members", error });
  }
};
