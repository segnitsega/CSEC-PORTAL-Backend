import { Request, Response } from "express"
import DivisionGroup from "../models/divisionGroupModel"
import Member from "../models/membersModel"

export const createGroup = async(req: Request | any, res: Response): Promise<void> => {
    const {clubRole} = req.user 
    if(clubRole === "Member"){
        res.status(403).json({message: "Unauthorized to create a group"})
        return;
    }  
    const {group, division} = req.body    
    const availableDivisions = await DivisionGroup.distinct('division'); 

    if(!group || !division){
        res.status(400).json({ message: "Group name and division required" })  
        return;
    } 

    if(!availableDivisions.includes(division)){
        res.status(400).json({ message: `${division} is not a valid division` });
        return;
    }

    const groupExist = await DivisionGroup.findOne({ division, groups: group})
    
    if(groupExist){
        res.status(400).json( {message: `${group} exists in ${division}`})     
        return    
    }  
    const topRoles = ["President", "Vice President"]

    const divisionPresidents:{[key: string]: string} = {}
    availableDivisions.forEach((division) => {
        divisionPresidents[`${division} President`] = division
    })    

    if (topRoles.includes(clubRole) || divisionPresidents[clubRole] === division) {       
        try {  
            const newGroup = await DivisionGroup.updateOne(
                { division },
                { $addToSet: { groups: group } }
              );
              
            res.status(201).json({ message: "New group created", group: newGroup });

        } catch (error) {
            console.error("Error creating group:", error);
            res.status(500).json({ message: "Failed to create group", error });
        }
    } else { 
        res.status(403).json({ message: `${clubRole} cannot create a group in ${division} division` });
    }
} 

export const getGroupMembers = async(req: Request, res: Response): Promise<void> => {
 
    if(!req.body){
        res.status(400).json({message: "Group name and division required"})
        return
    }  
    const {division, group} = req.body 
    if(!group || !division){
        res.status(400).json({ message: "Group name and division required" })  
        return;
    }  
    const groupExist = await DivisionGroup.findOne({ groups: group, division}) 
    if(!groupExist){
        res.status(400).json({ message: `Group "${group}" does not exist in ${division}`})  
        return;
    }   
    try{
        const groupMembers = await Member.find({division, group}).select("-password -refreshToken")
        if (groupMembers.length === 0) {
            res.status(404).json({ message: "No members found in this group" });
            return;
        }
        res.status(200).json({ 
            message: "Members retrieved", 
            length: groupMembers.length,
            groupMembers: groupMembers });

    }catch (error) {
        console.error("Error fetching group members:", error);
        res.status(500).json({ message: "Failed to fetch members", error });
      }
    
} 
