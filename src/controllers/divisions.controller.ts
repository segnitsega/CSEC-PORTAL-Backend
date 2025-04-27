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
        res.status(500).json({message: "Failed to get divisions", error: error})
    }
};

export const getGroups = async (req: Request, res:Response): Promise<void> => {
    const division = req.params.division   
    try{
        const availableDivisions = await DivisionGroup.distinct('division'); 
        if(!availableDivisions.includes(division)){
            res.status(400).json({message: "Invalid division"})
            return
        }
        const divisionDocument = await DivisionGroup.findOne({division}).select('groups');
        if(divisionDocument){
            res.status(200).json({
                length: divisionDocument.groups.length,
                groups: divisionDocument.groups 
            })
        }
                
    }catch(error){ 
        res.status(500).json({message: "Failed to get groups", error: error})
    }
}

export const createDivision = async (req: Request | any, res: Response): Promise<void> => {

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
 
    try{ 
        const divisionExists = await DivisionGroup.findOne({division: divisionName}); 
        if(divisionExists){
            res.status(400).json({message: `division "${divisionName}" already exist`})
            return
        }
        const memberExists = await Member.findOne({email})
        if(!memberExists){
            res.status(400).json({message: `Invalid email, member with email ${email} does not exist`})
            return
        }
        const newDivision = await DivisionGroup.create({ division: divisionName })  // creates a new division
        await Member.findOneAndUpdate({email}, {$set:{clubRole: divisionName + " " + "President"}}) // update the head's role to the created division's president

        const Division = await getDivisionModel(divisionName) // get the divisionModel to create the new division's collection dynamically
        const existingDivisionDoc = await Division.findOne({ name: divisionName });
        
        if (!existingDivisionDoc) {
            await Division.create({ name: divisionName, divisionHead: headName}) // if division does not exist, it creates a new division collection
        }

        res.status(201).json({ message:"Division created successfully", division:  newDivision})

    }catch(error){
        res.status(500).json({message: "Failed to create division", error: error})
    }

}
