import Member from "../models/membersModel";
import { NextFunction, Request, Response } from "express";

export const updateLastSeen = async(req: Request | any, res: Response, next: NextFunction) => {
    try{
        await Member.findOneAndUpdate(
        { email: req.user.email }, 
        { $set: {lastSeen: new Date} }
    )
    } catch(error){
        console.log("Failed to update lastSeen", error)
    }   
    next()
}