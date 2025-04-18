import { Request, Response } from "express"
import Session from "../models/sessionsModel"
import DivisionGroup from "../models/divisionGroupModel"
import dayjs from "dayjs"

export const createSession = async(req: Request | any, res: Response) => {
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

    const availableDivisions = await DivisionGroup.distinct('division'); 
    if(!availableDivisions.includes(division)){
        res.status(400).json({ message: `${division} is not a valid division` });
        return;
    }

    if (!Array.isArray(sessions) || sessions.some(session => !session.day || !session.startTime || !session.endTime)) {
        return res.status(400).json({ message: "Invalid session format" });
    }
    
    const topRoles = ["President", "Vice President"]
    const divisionPresidents:{[key: string]: string} = {}
    availableDivisions.forEach((division) => {
        divisionPresidents[`${division} President`] = division
    })

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
        } else { 
            res.status(403).json({ message: `${clubRole} cannot create a session in ${division} division` });
        }
}



  