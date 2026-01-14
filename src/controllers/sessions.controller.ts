import { Request, Response } from "express";
import { sessionService } from "../services/session.service";
import { handleServiceError } from "../errors/ServiceError";
import { AuthenticatedRequest } from "../types/express";

export const createSession = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const result = await sessionService.createSession(req.user!.clubRole, req.body);
    res.status(201).json(result);
  } catch (error) {
    if (handleServiceError(res, error)) return;
    console.error("Error creating session:", error);
    res.status(500).json({ message: "Failed to create session", error });
  }
};

export const getSessions = async (req: Request, res: Response) => {
  try {
    const result = await sessionService.listSessions(req.query.page, req.query.limit);
    res.status(200).json(result);
  } catch (error) {
    if (handleServiceError(res, error)) return;
    console.error("Error fetching sessions:", error);
    res.status(500).json({ message: "Failed to fetch sessions", error });
  }
};

export const deleteSession = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const result = await sessionService.deleteSession(req.user!.clubRole, req.params.id);
    res.status(200).json(result);
  } catch (error) {
    if (handleServiceError(res, error)) return;
    res.status(500).json({ message: "Error deleting session", error });
  }
};

export const updateSession = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const result = await sessionService.updateSession(req.user!.clubRole, req.params.id, req.body);
    res.status(200).json(result);
  } catch (error) {
    if (handleServiceError(res, error)) return;
    res.status(500).json({ message: "Error updating session", error });
  }
};
