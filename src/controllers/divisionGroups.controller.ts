import { Request, Response } from "express"
import DivisionGroup from "../models/divisionGroupModel"

export const createGroup = async(req: Request | any, res: Response): Promise<void> => {
    const {group, division} = req.body 
    const {clubRole} = req.user 
    const allowedDivisions = [ "DEV", "CPD", "CBD", "SEC", "DS" ] 

    if(!group || !division){
        res.status(400).json({ message: "Group name and division required" })  
        return;
    }  
    
    if(!allowedDivisions.includes(division)){
        res.status(400).json({ message: `${division} is not a valid division` });
        return;
    }

    if(clubRole === "Member"){
        res.status(403).json({message: "Unauthorized to create a group"})
        return;
    }  

    const groupExist = await DivisionGroup.findOne({group, division})
    
    if(groupExist){
        res.status(400).json( {message: `${group} exists in ${division}`})         
    } 

    const topRoles = ["President", "Vice President"]

    const divisionPresidents: { [key: string]: string } = {
        "CPD President": "CPD",
        "CBD President": "CBD",
        "DEV President": "DEV",
        "SEC President": "SEC",
        "DS President": "DS"
    }

    if (topRoles.includes(clubRole) || divisionPresidents[clubRole] === division) {
        
        try {
            const newGroup = await DivisionGroup.create({ group, division });
            res.status(201).json({ message: "New group created", group: newGroup });

        } catch (error) {
            console.error("Error creating group:", error);
            res.status(500).json({ message: "Failed to create group", error });

        }
    } else { 
        res.status(403).json({ message: `${clubRole} cannot create a group in ${division} division` });
    }
} 