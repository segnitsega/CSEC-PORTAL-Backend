import { Request, Response } from "express"
import Session from "../models/sessionsModel"
import DivisionGroup from "../models/divisionGroupModel"
import dayjs from "dayjs"

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

    if(!sessionTitle || !division || !groups || !startDate || !endDate){
        res.status(400).json({ message: "sessionTitle,division, groups, startDate, endDate, and sessions are required" });
        return
    }

    const availableDivisions = await DivisionGroup.distinct('division'); 
    if(!availableDivisions.includes(division)){
        res.status(400).json({ message: `${division} is not a valid division` });
        return;
    }

    if (!Array.isArray(sessions) || sessions.some(session => !session.day || !session.startTime || !session.endTime)) {
        res.status(400).json({ message: "Invalid session format" });
        return
    }
    
    const topRoles = ["President", "Vice President"]
    const divisionPresidents:{[key: string]: string} = {}
    availableDivisions.forEach((division) => {
        divisionPresidents[`${division} President`] = division
    })

    const sessionExists = await Session.findOne({sessionTitle})
    if(sessionExists){
        res.status(400).json({ message: `${sessionTitle} already exist` })
        return
    }

    const formattedStartDate = dayjs(startDate).format("YY/MM/DD")
    const formattedEndDate = dayjs(endDate).format("YY/MM/DD")
    if (topRoles.includes(clubRole) || divisionPresidents[clubRole] === division) {       
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




  