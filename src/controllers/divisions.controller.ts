import divisionGroupModel from "../models/divisionGroupModel";
import { Request, Response } from "express"
import DivisionGroup from "../models/divisionGroupModel"
import { authenticateToken } from "../middlewares/authMiddleware";
import Member from "../models/membersModel";
import { getDivisionModel } from "../models/dynamicDivisionModel";

export const getAllDivisions = async (req: Request, res: Response): Promise<void> => {
    try{
        const divisions = await DivisionGroup.distinct('division');
        res.status(200).json(divisions)

    }
    catch(error){
        res.status(500).json({message: "Failed to get divisions"})
    }
};

export const getGroups = async (req: Request, res:Response): Promise<void> => {
    const {division} = req.body
    if (!division){
        res.status(401).json({message: "division required"})
        return
    } 
    try{

        const groups = await DivisionGroup.find({division});
        res.status(200).json(groups)

    }catch{
        res.status(500).json({message: "Failed to get groups"})
    }

}

export const createDivision = async (req: Request | any, res: Response): Promise<void> => {
    
    const { divisionName, headName, email } = req.body;
    const { clubRole } = req.user;
    const allowedRoles = ["President", "Vice President"];

    if(!divisionName || !email){
        res.status(403).json({message: "divisionName and email required"})
    }

    if(!allowedRoles.includes(clubRole)){
        res.status(403).json({message: `${clubRole} can not add a division`})
    }
    
    const head = divisionName + " " + "President";
    try{
        const newDivision = await divisionGroupModel.create({ division: divisionName })
        await Member.findOneAndUpdate({email}, {$set:{clubRole: head}})

        const Division = getDivisionModel(divisionName)
        await Division.create({ name: divisionName, divisionHead: headName})

        res.status(201).json({ message:"Division created successfully", division:  newDivision})

    }catch(error){
        res.status(500).json({message: "Failed to create division"})
    }

}
