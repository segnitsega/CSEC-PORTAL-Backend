import Member from "../models/membersModel";
import { Request, Response } from "express";
import bcrypt from 'bcrypt'
import jwt, {JwtPayload, VerifyErrors} from 'jsonwebtoken'
import { sendOnboardingEmail } from "../utils/Mailer";
import DEV from "../models/devModel"
import CPD from "../models/cpdModel"
import DS from "../models/dsModel"
import CBD from "../models/cbdModel"
import SEC from "../models/secModel"
import { getDivisionData } from "../utils/getDivisionData";
const secretKey = process.env.SECRET_KEY || ""
const refreshKey = process.env.REFRESH_KEY || ""


export const getMembers = async(req: Request, res: Response): Promise<void> => {
    try{
        const members = await Member.find().select("-password -refreshToken")
        
        const membersWithDivisionData = await Promise.all(
            members.map(async(member) => {
                const divisionData = await getDivisionData(member)
                return {
                    ...member.toObject(), 
                    divisionData
                }
            })
        )
        res.status(200).json(membersWithDivisionData)
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

        const divisionData = await getDivisionData(member)        
        res.status(200).json({
            ...member?.toObject(),
            divisionData
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

export const handleMemberOnboarding = async(req: Request, res: Response): Promise<void> => {

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

    try{
        const hashedPassword = await bcrypt.hash(generatedPassword, 10) 

        const newMember = new Member({
            division,  
            email, 
            password: hashedPassword 
        }) 
        await newMember.save() 

        switch(division){
            case "DEV":
                await DEV.create({ member: newMember._id, group: group});
                break
            case "CPD":
                await CPD.create({ member: newMember._id, group: group });
                break

            case "DS":
                await DS.create({ member: newMember._id, group: group });
                break
            case "SEC":
                await SEC.create({ member: newMember._id, group: group });
                break
            default:
                await CBD.create({ member: newMember._id, group: group });
                break
        }     
        // const sendResult = await sendOnboardingEmail(email, generatedPassword)
        // res.status(200).json({ message: "New member created successfuly", result: sendResult })
        res.status(200).json({ message: "New member created successfuly" })
    }catch(error){ 
        console.log(error)
        res.status(500).json({ message: "Faied to create new member", error: error })
    }

} 

export const handleProfileDetails = async(req: Request, res: Response): Promise<void> => {
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
        division // the frontend should add the division of the member in the form submitted
    } = req.body 

    const foundMember = await Member.findOne({ email: email }).exec()

    if(!foundMember){
        res.status(404).json({ message: "Member not found" })
        return
    }

    try {
        await Member.updateOne( { email: email },
            { $set: {
                    firstName,
                    lastName, 
                    phoneNumber, 
                    birthDate, 
                    github, 
                    gender, 
                    telegramHandle, 
                    graduationYear, 
                    specialization, 
                    department, 
                    universityId, 
                    instagramHandle, 
                    LinkedinHandle, 
                    cv, 
                    bio,
                    mentor
            }})

        switch(division){
            case "DEV":  
                await DEV.findOneAndUpdate( { member: foundMember._id }, { $set: { codeforcesHandle, leetcodeHandle } }); 
                break
            case "CPD":
                await CPD.findOneAndUpdate( { member: foundMember._id }, { $set: { codeforcesHandle, leetcodeHandle  } });
                break
            case "SEC":
                await SEC.findOneAndUpdate( { member: foundMember._id }, { $set: { codeforcesHandle, leetcodeHandle  } });
                break 
            case "DS":
                await DS.findOneAndUpdate( { member: foundMember._id }, { $set: { codeforcesHandle, leetcodeHandle  } });
                break
            case "CBD":
                await CBD.findOneAndUpdate( { member: foundMember._id }, { $set: { codeforcesHandle, leetcodeHandle  } });
                break 
            default:
                res.status(400).json({ message: "Invalid division" }) 
            }
        
        res.status(200).json({ message: "Profile updated successfully" });
    } 
    catch(error){
        console.error(error);
        res.status(500).json({ message: "Failed to update member profile", error });
    }
}
