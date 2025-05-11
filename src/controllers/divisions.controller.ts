import { Request, Response } from "express"
import DivisionGroup from "../models/divisionGroupModel"
import { getDivisionModel } from "../models/dynamicDivisionModel";
import Member from "../models/membersModel";

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
    const { clubRole } = req.user;
    const allowedRoles = ["President", "Vice President"];
    if(!allowedRoles.includes(clubRole)){
        res.status(403).json({message: `${clubRole} can not add a division`})
        return
    }
    const { divisionName } = req.body;
    try{ 
        const newDivision = await DivisionGroup.create({ division: divisionName })  
        const Division = await getDivisionModel(divisionName)
        await Division.create({ name: divisionName }) 
        res.status(201).json({ message:"Division created successfully", division:  newDivision})
    }catch(error){
        console.log(error)
        res.status(500).json({message: "Failed to create division", error: error})
    }
}

export const getDivisionMembers = async(req: Request, res: Response): Promise<void> => {
    const division = req.params.division
    try{
        const availableDivisions = await DivisionGroup.distinct('division')
        if(!availableDivisions.includes(division)){
            res.status(400).json({message: "Invalid division"})
            return
        }
        const divisionMembers = await Member.find({division}).select("firstName lastName")
        res.status(200).json({
            length: divisionMembers.length,
            divisionMembers: divisionMembers
        })
    }catch(error){
        res.status(500).json({message: "Failed to get members", error: error})
    }
}

export const getDivisionSummary = async (req: Request, res: Response): Promise<void> => {
  try {
    const divisionDocs = await DivisionGroup.find({});
    const result = await Promise.all(
      divisionDocs.map(async (divisionDoc) => {
        const { division, groups } = divisionDoc;
        const groupsWithMembers = await Promise.all(
          groups.map(async (groupName: string) => {
            const members = await Member.find({ division, group: groupName })
              .select('-password -refreshToken')
              .sort({ createdAt: -1 });
            return {
              group: groupName,
              memberCount: members.length,
              members
            };
          }));
        return { division, groupCount: groups.length, groups: groupsWithMembers };
      })
    );
    res.status(200).json(result);
  } catch (error) {
    console.error("Error getting all division details:", error);
    res.status(500).json({ message: "Failed to get division details", error });
  }
};
