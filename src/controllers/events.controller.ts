import { Request, Response } from "express";
import { eventService } from "../services/event.service";
import { handleServiceError } from "../errors/ServiceError";

export const addEvent = async (req: Request | any, res: Response) => {
  try {
    const result = await eventService.addEvent(req.user.clubRole, req.body);
    res.status(201).json(result);
  } catch (error) {
    if (handleServiceError(res, error)) return;
    console.error("Error creating session:", error);
    res.status(500).json({ message: "Failed to add event", error });
  }
};

export const getEvents = async (req: Request, res: Response) => {
  try {
    const result = await eventService.listEvents(req.query.page, req.query.limit);
    res.status(200).json(result);
  } catch (error) {
    if (handleServiceError(res, error)) return;
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Failed to fetch events", error });
  }
};

export const deleteEvent = async (req: Request | any, res: Response): Promise<void> => {
  try {
    const result = await eventService.deleteEvent(req.user.clubRole, req.params.id);
    res.status(200).json(result);
  } catch (error) {
    if (handleServiceError(res, error)) return;
    res.status(500).json({ message: "Error deleting event", error });
  }
};

export const updateEvent = async (req: Request | any, res: Response): Promise<void> => {
  try {
    const result = await eventService.updateEvent(req.user.clubRole, req.params.id, req.body);
    res.status(200).json(result);
  } catch (error) {
    if (handleServiceError(res, error)) return;
    res.status(500).json({ message: "Error updating event", error });
  }
};
