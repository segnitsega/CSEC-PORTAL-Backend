import Member from "../models/membersModel";
import { Request, Response } from "express";
import bcrypt from 'bcrypt'
import jwt, {JwtPayload, VerifyErrors} from 'jsonwebtoken'
const secretKey = process.env.SECRET_KEY || ""
const refreshKey = process.env.REFRESH_KEY || ""

export const getMembers = async(req: Request, res: Response): Promise<void> => {
    try{
        const members = await Member.find().select("-password -refreshToken")
        res.status(200).json(members)
    }
    catch(error){
        res.status(500).json({message: 'Error to fetch members', error})
        console.log(error)
    }
}

export const handleLogin = async(req: Request, res: Response): Promise<void> => {
    try{
        if(Object.keys(req.body).length === 0){
            res.status(400).json({message: "Login request body is empty"})
            return
        }
        const { email, password } = req.body
        const foundMember = await Member.findOne({email})

        if(!foundMember){
            res.status(404).json({message: "Member not found"})
            return
        } 

        const passwordMatch = await bcrypt.compare(password, foundMember.password)
        if (!passwordMatch) {
            res.status(401).json({ message: "Invalid password" }) 
            return  
        }

        const token = jwt.sign({id: foundMember._id, email: foundMember.email, clubRole: foundMember.clubRole}, secretKey, {expiresIn: "2h"}) 
        const refreshToken = jwt.sign({id: foundMember._id, email: foundMember.email}, refreshKey, {expiresIn: "7d"})

        await Member.updateOne({email}, {$set: {refreshToken}})

       res.status(200).json({
        message: "Login Successful",
        token,
        refreshToken
       })
    }
    catch (error){
        console.log(error)
        res.status(500).json({message: "Server error", error})
    }   
}  

export const handleRefreshToken = async(req: Request, res: Response): Promise<void> => { 
    try{
        let refreshToken = req.headers['authorization']?.split(' ')[1] || req.body.refreshToken
        if(!refreshToken){ 
            res.status(401).json({message: "No refresh token provided"})
            return
        }
        const foundMember = await Member.findOne({ refreshToken })
        if(!foundMember){
            res.status(403).json({message: "Invalid refresh token"})
            return
        }

        jwt.verify(refreshToken, refreshKey, (error: VerifyErrors | null, decoded:string | JwtPayload | undefined) => {
            if(error){ 
                return res.status(403).json({message: "Token verification failed"})
            }   
            const newAccessToken = jwt.sign({id: foundMember._id, email: foundMember.email, clubRole: foundMember.clubRole}, secretKey, {expiresIn: "2h"})

            res.status(200).json({
                message: "Token refreshed",
                token: newAccessToken
            })
        })
    } catch(error) {
        console.log(error)
        res.status(500).json({message: "Server error", error})
    }
 } 
