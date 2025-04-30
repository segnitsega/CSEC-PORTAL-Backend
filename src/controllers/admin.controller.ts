import express from "express"
import { Request, Response } from "express"
import Member from "../models/membersModel"
import { getDivisionModel } from "../models/dynamicDivisionModel";
import DivisionGroup from "../models/divisionGroupModel";

export const addNewRole = async (req: Request | any,res:Response): Promise<void>=> {
   
    const {clubRole} = req.user
    const topRoles = ["President", "Vice President"]

    if(!topRoles.includes(clubRole)){
        res.status(401).json({message: `${clubRole} can not assign new role`})
        return
    }
    const { division, name, email, role} = req.body;
    if(!division || !name || !email || !role){
        res.status(400).json({message: "division, name, email, and role are required"})
        return
    }
    const divisionExists = await DivisionGroup.findOne({division: division}); 
    if(!divisionExists){
        res.status(400).json({message: `division "${division}" does not exist`})
        return
    }

    const memberExists = await Member.findOne({email})
    if(!memberExists){
        res.status(400).json({message: `Invalid email, member with email ${email} does not exist`})
        return
    }

    try{
        //Demote the current head of the division, because a division can't have duplicate heads
        await Member.findOneAndUpdate(
            { clubRole: division + " " + "President" }, 
            { $set:{ clubRole: "Member" } }
        )
        
        //assign a new head
        await Member.findOneAndUpdate(
            { email }, 
            { $set:{clubRole: division + " " + "President" } }
        )      

        // change the division head name in the division model
        const Division = await getDivisionModel(division)
        console.log(`Division model is: ${Division}`)

        await Division.findOneAndUpdate(
            { name: division }, 
            { $set:{ divisionHead: name } } 
        )

        res.status(200).json({
            message: `${name} has been successfully assigned as ${division} President.`,
        });
        
    }catch(error){
        console.error("Error assigning new role:", error);
        res.status(500).json({
            message: "Unable to assign new role.",
            error: error,
        });
    }

}