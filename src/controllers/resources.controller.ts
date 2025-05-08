import Resource from "../models/resourcesModel";
import { Request, Response } from "express";
import { canManageDivision } from "../utils/checkDivisionHead";

export const addResource = async(req: Request | any, res: Response): Promise<void> => {
    const { clubRole } = req.user;
    if(clubRole === "Member"){
        res.status(403).json({message: "Unauthorized to add resources"})
        return;
    } 
    const {resourceName, resourceLink, division} = req.body      
    if (await canManageDivision(clubRole, division)) {
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
        res.status(403).json({ message: `${clubRole} can not add resource in ${division}` });
    }
}

export const getResources = async(req: Request, res: Response): Promise<void> => {
    try{
        // const page = parseInt(req.query.page as string) || 1;
        // const limit = parseInt(req.query.limit as string) || 10;

        // const skip = (page - 1) * limit;

        //  const [resources, total] = await Promise.all([
        //     Resource.find().skip(skip).limit(limit).sort({ createdAt: -1 }), 
        //     Resource.countDocuments()
        // ]);

        // const resources = await Resource.find()
        // if (resources.length === 0) {
        //     res.status(200).json({ message: "No resources available", Resources: [] });
        //     return;
        // }
        const resources = await Resource.find()
        if(!resources){
          res.status(404).json({message: "No resources found"})
          return
        }
        res.status(200).json({
            totalResources: resources.length,
            Resources: resources
        })
        
    }catch(err){
        res.status(500).json({message: "unable to get resources", error: err})
    }
}

export const deleteResource = async (req: Request | any, res: Response): Promise<void> => {
    const { clubRole } = req.user;
    
    if (clubRole === "Member") {
      res.status(403).json({ message: `${clubRole} cannot delete a resource` });
      return;
    }
  
    const { id } = req.params;
    const resource = await Resource.findById(id);
    if (await canManageDivision(clubRole, resource?.division!)) {
      try {
        const deletedResource = await Resource.findByIdAndDelete(id);
        if (!deletedResource) {
          res.status(404).json({ message: "Resource not found" });
          return;
        } 
        res.status(200).json({ message: "Resource deleted successfully" });
      } catch (error) {
        res.status(500).json({ message: "Error deleting resource", error });
      }
    } else {
      res.status(403).json({ message: "Unauthorized to delete this resource" });
    }
  };

export const updateResource = async (req: Request | any, res: Response): Promise<void> => {
  const { clubRole } = req.user;

  if (clubRole === "Member") {
    res.status(403).json({ message: `${clubRole} cannot update a resource` });
    return;
  }

  const { id } = req.params;
  const updatedData = req.body;
  const resource = await Resource.findById(id);
  if (await canManageDivision(clubRole, resource?.division!)) {
    try {
      const updatedResource = await Resource.findByIdAndUpdate(id, updatedData, { new: true });
      if (!updatedResource) {
        res.status(404).json({ message: "Resource not found" });
        return;
      }
      res.status(200).json({ message: "Resource updated successfully", updatedResource });
    } catch (error) {
      res.status(500).json({ message: "Error updating resource", error });
    }
  } else {
    res.status(403).json({ message: "Unauthorized to update this resource" });
  }
};