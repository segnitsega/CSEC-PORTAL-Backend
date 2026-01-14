import { Request, Response } from "express";
import { divisionService } from "../services/division.service";
import { handleServiceError } from "../errors/ServiceError";
import { AuthenticatedRequest } from "../types/express";

export const getAllDivisions = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await divisionService.listDivisions();
    res.status(200).json(result);
  } catch (error) {
    if (handleServiceError(res, error)) return;
    res.status(500).json({ message: "Failed to get divisions", error: error });
  }
};

export const getGroups = async (req: Request, res: Response): Promise<void> => {
  const division = req.params.division;
  try {
    const result = await divisionService.getGroups(division);
    if (result) {
      res.status(200).json(result);
    }
  } catch (error) {
    if (handleServiceError(res, error)) return;
    res.status(500).json({ message: "Failed to get groups", error: error });
  }
};

export const createDivision = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const result = await divisionService.createDivision(req.user!.clubRole, req.body.divisionName);
    res.status(201).json(result);
  } catch (error) {
    if (handleServiceError(res, error)) return;
    console.log(error);
    res.status(500).json({ message: "Failed to create division", error: error });
  }
};

export const getDivisionMembers = async (req: Request, res: Response): Promise<void> => {
  const division = req.params.division;
  try {
    const result = await divisionService.getDivisionMembers(division);
    res.status(200).json(result);
  } catch (error) {
    if (handleServiceError(res, error)) return;
    res.status(500).json({ message: "Failed to get members", error: error });
  }
};

export const getDivisionSummary = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await divisionService.getDivisionSummary();
    res.status(200).json(result);
  } catch (error) {
    if (handleServiceError(res, error)) return;
    console.error("Error getting all division details:", error);
    res.status(500).json({ message: "Failed to get division details", error });
  }
};
