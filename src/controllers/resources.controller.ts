import { Request, Response } from "express";
import { resourceService } from "../services/resource.service";
import { handleServiceError } from "../errors/ServiceError";
import { AuthenticatedRequest } from "../types/express";

export const addResource = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const result = await resourceService.addResource(req.user!.clubRole, req.body);
    res.status(201).json(result);
  } catch (error) {
    if (handleServiceError(res, error)) return;
    console.error("Error adding resource:", error);
    res.status(500).json({ message: "Failed to add resources", error });
  }
};

export const getResources = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await resourceService.listResources();
    res.status(200).json(result);
  } catch (err) {
    if (handleServiceError(res, err)) return;
    res.status(500).json({ message: "unable to get resources", error: err });
  }
};

export const deleteResource = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const result = await resourceService.deleteResource(req.user!.clubRole, req.params.id);
    res.status(200).json(result);
  } catch (error) {
    if (handleServiceError(res, error)) return;
    res.status(500).json({ message: "Error deleting resource", error });
  }
};

export const updateResource = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const result = await resourceService.updateResource(req.user!.clubRole, req.params.id, req.body);
    res.status(200).json(result);
  } catch (error) {
    if (handleServiceError(res, error)) return;
    res.status(500).json({ message: "Error updating resource", error });
  }
};
