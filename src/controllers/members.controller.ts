import Member from "../models/membersModel";
import { Request, Response } from "express";
import bcrypt from 'bcrypt'
import jwt, {JwtPayload, VerifyErrors} from 'jsonwebtoken'

const secretKey = process.env.SECRET_KEY || ""
const refreshKey = process.env.REFRESH_KEY || ""

export const getMembers = async(req: Request, res: Response): Promise<void> => {
    try{
        const members = await Member.find()
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

        const token = jwt.sign({id: foundMember.user_id, email: foundMember.email}, secretKey, {expiresIn: "2h"})
        const refreshToken = jwt.sign({id: foundMember.user_id, email: foundMember.email}, refreshKey, {expiresIn: "7d"})

        await Member.updateOne({email}, {$set: {refreshToken}})

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 2 * 60 * 60 * 1000
        }).cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        }).status(200).json({message: "Login Successful"})

    }
    catch (error){
        console.log(error)
        res.status(500).json({message: "Server error", error})
    }   
}  

export const handleRefreshToken = async(req: Request, res: Response): Promise<void> => { 
    try{
        const refreshToken = req.cookies.refreshToken
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
            const accessToken = jwt.sign({id: foundMember.user_id, email: foundMember.email}, secretKey, {expiresIn: "7d"})

            res.cookie("token", accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 2 * 60 * 60 * 1000,
            }).status(200).json({message: "Token refreshed"})
        })
    } catch(error) {
        console.log(error)
        res.status(500).json({message: "Server error", error})
    }
 } 

