import { Request, Response } from "express"
import DivisionGroup from "../models/divisionGroupModel"
import Member from "../models/membersModel";
import { getDivisionModel } from "../models/dynamicDivisionModel";

export const getAllDivisions = async (req: Request, res: Response): Promise<void> => {
    try{ 
        const divisions = await DivisionGroup.distinct('division');
        res.status(200).json({length: divisions.length, divisions: divisions})
    } 
    catch(error){
        res.status(500).json({message: "Failed to get divisions"})
    }
};

export const getGroups = async (req: Request, res:Response): Promise<void> => {
    
    if(!req.body){ 
        res.status(400).json({message: "request body is empty, division required to retrieve division groups"})
        return
    }
    
    const {division} = req.body
    if (!division){
        res.status(401).json({message: "division required"})
        return
    } 
    const availableDivisions = await DivisionGroup.distinct('division'); 
    if(!availableDivisions.includes(division)){
        res.status(400).json({message: "Invalid division"})
        return
    }

    try{
        const divisionDocument = await DivisionGroup.findOne({division}).select('groups');
        if(divisionDocument){
            res.status(200).json({
                length: divisionDocument.groups.length,
                groups: divisionDocument.groups 
            })
        }
                
    }catch{ 
        res.status(500).json({message: "Failed to get groups"})
    }
}

export const createDivision = async (req: Request | any, res: Response): Promise<void> => {
    
    if(!req.body){
        res.status(400).json({message: "Request body empty"})
        return
    }
    const { divisionName, headName, email } = req.body;
    const { clubRole } = req.user;
    const allowedRoles = ["President", "Vice President"];

    if(!divisionName || !email || !headName){
        res.status(403).json({message: "divisionName, headName and email required"})
        return
    }

    if(!allowedRoles.includes(clubRole)){
        res.status(403).json({message: `${clubRole} can not add a division`})
        return
    }
    
    const divisionExists = await DivisionGroup.findOne({division: divisionName}); 
    if(divisionExists){
        res.status(400).json({message: `division "${divisionName}" already exist`})
        return
    } 
    try{ 
        const newDivision = await DivisionGroup.create({ division: divisionName }) 
        await Member.findOneAndUpdate({email}, {$set:{clubRole: divisionName + " " + "President"}})

        const Division = await getDivisionModel(divisionName)

        const existingDivisionDoc = await Division.findOne({ name: divisionName });
        
        if (!existingDivisionDoc) {
            await Division.create({ name: divisionName, divisionHead: headName})
        }

        res.status(201).json({ message:"Division created successfully", division:  newDivision})

    }catch(error){
        res.status(500).json({message: "Failed to create division"})
    }

}
