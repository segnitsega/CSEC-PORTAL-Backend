import Member from "../models/membersModel";
import { Request, Response } from "express";
import bcrypt from 'bcrypt'
import jwt, {JwtPayload, VerifyErrors} from 'jsonwebtoken'
import { sendOnboardingEmail } from "../utils/Mailer";
import DivisionGroup from "../models/divisionGroupModel";

const secretKey = process.env.SECRET_KEY || ""
const refreshKey = process.env.REFRESH_KEY || ""


export const getMembers = async(req: Request | any, res: Response): Promise<void> => {
    try{
        const members = await Member.find().select("-password -refreshToken")
        res.status(200).json({
            length: members.length,
            members: members
        })
    } 
    catch(error){
        res.status(500).json({message: 'Error to fetch members', error})
        console.log(error) 
    }
}

export const getMemberById = async(req: Request, res: Response): Promise<void> => {
    const id = req.params.id
    try{
        const member = await Member.findById(id).select("-password -refreshToken")

        if(!member){
            res.status(404).json({message: "Member not found"})
            return
        }
        res.status(200).json({
            member
        })
    }
    catch(error){
        res.status(501).json({ message: "Error retrieving Member", error: error })
    }

}

export const handleLogin = async(req: Request, res: Response): Promise<void> => { 
    try{
        if(Object.keys(req.body).length === 0){
            res.status(400).json({message: "Login request body is empty"})
            return
        } 
        const { email, password } = req.body
        if (!email || !password) {
            res.status(400).json({ message: "Email and password are required" });
            return;
          }
          
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

        const token = jwt.sign({id: foundMember._id, email: foundMember.email, clubRole: foundMember.clubRole}, secretKey, {expiresIn: "5h"})  
        const refreshToken = jwt.sign({id: foundMember._id, email: foundMember.email, clubRole: foundMember.clubRole}, refreshKey, {expiresIn: "7d"})

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
        let refreshToken = req.headers['authorization']?.split(' ')[1] 
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

export const handleMemberOnboarding = async(req: Request | any, res: Response): Promise<void> => {
    const { clubRole } = req.user;
    
    if(clubRole === "Member"){
        res.status(403).json({message: `${clubRole} can not add a new member`})
        return
    } 
    const currentDivisions = await DivisionGroup.distinct('division')
    
    const {  
        division, 
        group, 
        email,  
        generatedPassword 
    } = req.body 

    const emailExist = await Member.findOne({email})
    if(emailExist){ 
        res.status(400).json('Email already used')
        return
    }  
    if(!currentDivisions.includes(division)){
        res.status(400).json(`${division} not present`)
        return
    } 
    const hashedPassword = await bcrypt.hash(generatedPassword, 10) 
    const newMember =  new Member({
        division,  
        group,
        email, 
        password: hashedPassword 
    })  
    await newMember.save() 

    res.status(200).json({ message: "New member created successfully", newMember });
    // const sendResult = await sendOnboardingEmail(email, generatedPassword)
    // res.status(200).json({ message: "New member created successfuly", result: sendResult })
    //add link in the email for the new member to log in with
} 

export const handleProfileDetails = async(req: Request, res: Response): Promise<void> => {
    try{
        const {
                firstName, 
                lastName, 
                phoneNumber, 
                email, 
                birthDate, 
                github, 
                gender, 
                telegramHandle, 
                graduationYear, 
                specialization, 
                department,
                mentor, 
                universityId, 
                instagramHandle, 
                LinkedinHandle,     
                codeforcesHandle, 
                cv, 
                leetcodeHandle, 
                bio,
            } = req.body 

        const profilePicture = req.file? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`: null;

        const foundMember = await Member.findOne({ email: email }).exec()
        if(!foundMember){
            res.status(404).json({ message: "Member not found" })
            return
        } 

        const updateData: { [key: string]: any } = {
            firstName, lastName, phoneNumber, birthDate, github,
            gender, telegramHandle, graduationYear, specialization,
            department, universityId, instagramHandle, LinkedinHandle,
            codeforcesHandle, leetcodeHandle, cv, bio, mentor,profilePicture
        };

        Object.keys(updateData).forEach((key) => {
            if (updateData[key] === undefined || updateData[key] === null) {
                delete updateData[key];
            }
        });

        await Member.updateOne( { email: email }, { $set: { ...updateData }})

        res.status(200).json({ message: "Profile updated successfully" });
            
    }    
    catch(error){
        console.error(error);
        res.status(500).json({ message: "Failed to update member profile", error });
    }
}


export const getAllHeads = async (req: Request, res: Response): Promise<void> => {
    try { 
      const heads = await Member.find({ clubRole: { $ne: "Member" } }).select("clubRole email");
  
      if (!heads || heads.length === 0) {
        res.status(400).json({ message: "No heads found" });
        return;
      }
      res.status(200).json({length:heads.length, heads });
    } catch (error) {
      res.status(500).json({ message: "Cannot get heads", error });
    }
  };
