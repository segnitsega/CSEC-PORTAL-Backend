import { Request, Response } from "express"
import DivisionGroup from "../models/divisionGroupModel"
import { getDivisionModel } from "../models/dynamicDivisionModel";
import Member from "../models/membersModel";
import { getDivisions, invalidateDivisions } from "../utils/divisionCache";

export const getAllDivisions = async (req: Request, res: Response): Promise<void> => {
    try{
        const divisions = await getDivisions();
        res.status(200).json({length: divisions.length, divisions: divisions})
    } 
    catch(error){
        res.status(500).json({message: "Failed to get divisions", error: error})
    }
};

export const getGroups = async (req: Request, res:Response): Promise<void> => {
    const division = req.params.division
    try{
        const availableDivisions = await getDivisions();
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
        invalidateDivisions()
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
        const availableDivisions = await getDivisions();
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
    const result = await DivisionGroup.aggregate([
      {
        $lookup: {
          from: Member.collection.name,
          let: { division: "$division" },
          pipeline: [
            { $match: { $expr: { $eq: ["$division", "$$division"] } } },
            { $sort: { createdAt: -1 } },
            { $project: { password: 0, refreshToken: 0 } },
          ],
          as: "divisionMembers",
        },
      },
      {
        $project: {
          _id: 0,
          division: 1,
          groupCount: { $size: "$groups" },
          groups: {
            $map: {
              input: "$groups",
              as: "groupName",
              in: {
                $let: {
                  vars: {
                    groupMembers: {
                      $filter: {
                        input: "$divisionMembers",
                        as: "member",
                        cond: { $eq: ["$$member.group", "$$groupName"] },
                      },
                    },
                  },
                  in: {
                    group: "$$groupName",
                    memberCount: { $size: "$$groupMembers" },
                    members: "$$groupMembers",
                  },
                },
              },
            },
          },
        },
      },
    ]);

    res.status(200).json(result);
  } catch (error) {
    console.error("Error getting all division details:", error);
    res.status(500).json({ message: "Failed to get division details", error });
  }
};
