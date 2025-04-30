import express from "express"
import { Request, Response } from "express"
import Member from "../models/membersModel"
import { getDivisionModel } from "../models/dynamicDivisionModel";

export const addNewRole = async (req: Request | any,res:Response): Promise<void>=> {
    
    if(Object.keys(req.body).length === 0){
        res.status(400).json({message: "request body is empty"})
        return
    }

    try{

    const { division, name, email, role} = req.body;
    console.log(division, name, email, role)
     // change the division head name on the division collection

        const Division = await getDivisionModel(division)

        if(!division){
            res.status(401).json({message: "Divison not found"}) 
            return;
        }
        const changed = await Division.updateOne({name: division}, {$set:{ divisionHead: name }, new: true})
        
        //change the existing head role to member

        const changed1 = await Member.findOneAndUpdate({clubRole: role}, {$set:{ clubRole: "Member" }, new: true})
        console.log(changed1)
       
        // change the new member to head
        await Member.updateOne({email: email}, {$set:{ clubRole: role}})
        
        
    }catch(error){
        console.log(error)
        res.status(500).json({message: "Unable to assign new role", error: error})
    }


}