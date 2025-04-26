import Resource from "../models/resourcesModel";
import { Request, Response } from "express";
import DivisionGroup from "../models/divisionGroupModel"


export const addResource = async(req: Request | any, res: Response): Promise<void> => {
    const { clubRole } = req.user;
    if(clubRole === "Member"){
        res.status(403).json({message: "Unauthorized to add resources"})
        return;
    } 
    const {resourceName, resourceLink, division} = req.body 
    if (!resourceName || !resourceLink || !division) {
        res.status(400).json({ message: "resourceName, resourceLink, and division are required" });
        return;
    }       
    const availableDivisions = await DivisionGroup.distinct('division'); 
    if(!availableDivisions.includes(division)){
        res.status(400).json({ message: `${division} is not a valid division` });
        return;
    }
    const resourceExists = await Resource.findOne({resourceName, division})
    if(resourceExists){
        res.status(400).json({message:  `${resourceName} already exists in ${division}`})
        return
    } 
    const topRoles = ["President", "Vice President"]

    const divisionPresidents:{[key: string]: string} = {}
    availableDivisions.forEach((division) => {
        divisionPresidents[`${division} President`] = division
    }) 

    if (topRoles.includes(clubRole) || divisionPresidents[clubRole] === division) {
        try{
             const newResource = await Resource.create({
                resourceName, 
                resourceLink, 
                division
            })
            res.status(201).json({ message: "New resource added successfully", Resource: newResource });
            return
        } catch (error) {
            console.error("Error adding resource:", error);
            res.status(500).json({ message: "Failed to add resources", error });
            return
       }
    }
    else{ 
        res.status(403).json({ message: `${clubRole} can not add resource in ${division} division` });
    }
}

export const getResources = async(req: Request, res: Response): Promise<void> => {
    try{
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const skip = (page - 1) * limit;

         const [resources, total] = await Promise.all([
            Resource.find().skip(skip).limit(limit).sort({ createdAt: -1 }), 
            Resource.countDocuments()
        ]);

        // const resources = await Resource.find()
        if (resources.length === 0) {
            res.status(200).json({ message: "No resources available", Resources: [] });
            return;
        }
        res.status(200).json({
            page,
            totalPages: Math.ceil(total / limit),
            totalResources: total,
            Resources: resources
        })
        
    }catch(err){
        res.status(500).json({message: "unable to get resources", error: err})
    }
}