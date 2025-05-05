import { Request, Response } from "express"
import Session from "../models/sessionsModel"
import dayjs from "dayjs"
import { canManageDivision } from "../utils/checkDivisionHead"

export const createSession = async(req: Request | any, res: Response): Promise<void> => {
  const {clubRole} = req.user
    if(clubRole === "Member"){
        res.status(403).json({message: `${clubRole} can not create a session`})
        return
    }     
    const {
        sessionTitle,
        division,
        groups,
        startDate,
        endDate,
        sessions
    } = req.body

    const formattedStartDate = dayjs(startDate).format("YY/MM/DD")
    const formattedEndDate = dayjs(endDate).format("YY/MM/DD")
    if (await canManageDivision(clubRole, division)) {       
        try {  
           const newSession = await Session.create({
                sessionTitle, 
                division, 
                groups, 
                startDate: formattedStartDate, 
                endDate: formattedEndDate, 
                sessions
           })
           res.status(201).json({ message: "New session created", session: newSession })

        } catch (error) {
                console.error("Error creating session:", error);
                res.status(500).json({ message: "Failed to create session", error });
            }
    }else { 
            res.status(403).json({ message: `${clubRole} cannot create a session in ${division} division` });
    }
}

export const getSessions = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const skip = (page - 1) * limit;

    const [sessions, total] = await Promise.all([
      Session.find().skip(skip).limit(limit).sort({ createdAt: -1 }), 
      Session.countDocuments()
    ]);

    res.status(200).json({
      page,
      totalPages: Math.ceil(total / limit),
      totalSessions: total,
      sessions
    });
  } catch (error) {
    console.error("Error fetching sessions:", error);
    res.status(500).json({ message: "Failed to fetch sessions", error });
  }
};

export const deleteSession = async (req: Request | any, res: Response): Promise<void> => {
  const { clubRole } = req.user;
  const { id } = req.params;

  if (clubRole === "Member") {
    res.status(403).json({ message: `${clubRole} cannot delete a session` });
    return;
  }

  const session = await Session.findById(id);
  if (!session) {
    res.status(404).json({ message: "Session not found" });
    return;
  }
  if (await canManageDivision( clubRole, session.division)) {
    try { 
     const deletedSession = await session.deleteOne(); 
      res.status(200).json({ message: "Session deleted successfully", deletedSession });
    } catch (error) {
      res.status(500).json({ message: "Error deleting session", error });
    }
  } else {
    res.status(403).json({ message: "You are not authorized to delete this session" });
  }
};

export const updateSession = async (req: Request | any, res: Response): Promise<void> => {
  const { id } = req.params;
  const { clubRole } = req.user;
  const updatedData = req.body;

  try {
    const session = await Session.findById(id);
    if (!session) {
      res.status(404).json({ message: "Session not found" });
      return;
    }
    if (await canManageDivision(clubRole, session.division)) {
      const updatedSession = await Session.findByIdAndUpdate(id, updatedData, { new: true });
      res.status(200).json({ message: "Session updated successfully", updatedSession });
    } else {
      res.status(403).json({ message: "You are not authorized to update this session" });
    } 
  } catch (error) {
    res.status(500).json({ message: "Error updating session", error });
  }
};




  