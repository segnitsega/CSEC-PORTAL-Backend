import Event from "../models/eventsModel";
import { Request, Response } from "express";
import DivisionGroup from "../models/divisionGroupModel"
import dayjs from "dayjs";

export const addEvent = async(req: Request | any, res: Response) => {
    const {clubRole} = req.user
    if(clubRole === "Member"){
        res.status(403).json({message: `${clubRole} can not add event`})
        return
    }

    const {
        eventTitle,
        division,
        groups,
        eventDate,
        startTime,
        endTime,
        visibility
    } = req.body 
    const eventExist = await Event.findOne({eventTitle})
    
    if(eventExist){
        res.status(400).json({message: `Event ${eventTitle} already exists`})
        return
    }

    const formattedDate = dayjs(eventDate).format("YY/MM/DD")
    const topRoles = ["President", "Vice President"]

    if(division && groups){
        const availableDivisions = await DivisionGroup.distinct('division'); 
        if(!availableDivisions.includes(division)){
            res.status(400).json({ message: `${division} is not a valid division` });
            return;
        }
        const divisionPresidents:{[key: string]: string} = {}
        availableDivisions.forEach((division) => {
            divisionPresidents[`${division} President`] = division
        })

        if(topRoles.includes(clubRole) || divisionPresidents[clubRole] === division){
            try{
                const newEvent = await Event.create({
                    eventTitle,
                    division,
                    groups,
                    eventDate: formattedDate,
                    startTime,
                    endTime,
                    visibility
                })
                res.status(201).json({ message: "New event added", Event: newEvent })
                return
            }catch(error){
                console.error("Error creating session:", error);
                res.status(500).json({ message: "Failed to add event", error });
                return
            }
        }
    }    

    try{
        const newEvent = await Event.create({
            eventTitle,
            eventDate: formattedDate,
            startTime,
            endTime,
            visibility
        })
        res.status(201).json({ message: "New event added", Event: newEvent })
        return
    } catch(error){
        console.error("Error creating session:", error);
        res.status(500).json({ message: "Failed to add event", error });
        return
    }
    
} 

export const getEvents = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
    
        const skip = (page - 1) * limit;
    
        const [events, total] = await Promise.all([
          Event.find().skip(skip).limit(limit).sort({ createdAt: -1 }), 
          Event.countDocuments()
        ]);
    
        res.status(200).json({
          page,
          totalPages: Math.ceil(total / limit),
          totalEvents: total,
          events
        });
      } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ message: "Failed to fetch events", error });
      }
}
