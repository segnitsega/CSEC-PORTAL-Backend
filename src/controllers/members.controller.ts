import Member from "../models/membersModel";
import { Request, Response } from "express";
import bcrypt from 'bcrypt'
import jwt, {JwtPayload, VerifyErrors} from 'jsonwebtoken'
import { sendOnboardingEmail } from "../utils/Mailer";
import mongoose from "mongoose";
import { uploadToCloudinary } from "../config/cloudinary";
import { canManageDivision } from "../utils/checkDivisionHead";

const secretKey = process.env.SECRET_KEY as string
const refreshKey = process.env.REFRESH_KEY as string

export const getMembers = async (req: Request | any, res: Response): Promise<void> => {
    
    try { 
      const {
        search,
        division,
        group,
        campusStatus,
        attendance,
        membershipStatus,
        divisionRole,
      } = req.query;

      const pageNumber = Math.max(1, parseInt(req.query.page as string, 10) || 1)
      const limitNumber = Math.max(1, parseInt(req.query.limit as string, 10) || 10)
      const skip = (pageNumber - 1) * limitNumber;


      const query: any = {};

      if (search) {
        const regex = new RegExp(search, 'i'); 
        query.$or = [
          { firstName: regex },
          { middleName: regex },
          { lastName: regex },
          { email: regex },
          { universityId: regex }
        ];
      }
  
      if (division) query.division = division;
      if (group) query.group = group;
      if (campusStatus) query.campusStatus = campusStatus;
      if (attendance) query.attendance = attendance;
      if (membershipStatus) query.membershipStatus = membershipStatus;
      if (divisionRole) query.divisionRole = divisionRole;
    
      const [members, total] = await Promise.all([
        Member.find(query)
          .select('-password -refreshToken')
          .skip(skip)
          .limit(limitNumber)
          .sort({ createdAt: -1 })
          .lean(),
        Member.countDocuments(query)
      ]);
  
      res.status(200).json({
        currentPage: pageNumber,
        totalPages: Math.ceil(total / limitNumber),
        totalMembers: total,
        members
      });
    } catch (error) {
      console.error("Error fetching members:", error);
      res.status(500).json({ message: 'Error fetching members', error });
    }
  };

export const getMemberById = async(req: Request, res: Response): Promise<void> => {
    const id = req.params.id
    try{
        const member = await Member.findById(id).select("-password -refreshToken").lean()
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
    if(Object.keys(req.body).length === 0){
            res.status(400).json({message: "Login request body is empty"})
            return
        } 
    const { email, password } = req.body
    if (!email || !password) {
        res.status(400).json({ message: "Email and password are required" });
        return;
    } 

    try{                 
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

        // set the expiration back to limited hours...
        const token = jwt.sign({id: foundMember._id, email: foundMember.email, clubRole: foundMember.clubRole}, secretKey, {expiresIn: "1d"})  
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
    let refreshToken = req.headers['authorization']?.split(' ')[1] 
    if(!refreshToken){ 
        res.status(401).json({message: "No refresh token provided"})
        return
    }
    try{        
        const foundMember = await Member.findOne({ refreshToken })
        if(!foundMember){
            res.status(403).json({message: "Invalid refresh token"})
            return
        }
        jwt.verify(refreshToken, refreshKey, (error: VerifyErrors | null, decoded:string | JwtPayload | undefined) => {
            if(error){ 
                return res.status(403).json({message: "Token verification failed", error: error})
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
    const {  
        firstName,
        lastName,
        division, 
        group, 
        email,  
        generatedPassword 
    } = req.body 

    const emailExist = await Member.findOne({email}).lean()
    if(emailExist){ 
        res.status(400).json('Email already used')
        return
    }  
    if (await canManageDivision(clubRole, division)){
        try{
            const hashedPassword = await bcrypt.hash(generatedPassword, 10) 
            const newMember =  new Member({
                firstName,
                lastName,
                division,  
                group,
                email, 
                password: hashedPassword 
            })  
            await newMember.save() 

            const sendResult = await sendOnboardingEmail(email, generatedPassword)
            res.status(200).json({ message: "New member created successfuly", member: newMember, emailResult: sendResult })
            return
        }catch(err){
            res.status(500).json({message: "Error adding a member", error: err})
            return
        }
    } else{
        res.status(403).json({message: `${clubRole} can not add member in ${division}`})
    }
    
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
                linkedinHandle,
                codeforcesHandle, 
                cv, 
                leetcodeHandle, 
                bio,
                resources
            } = req.body 

        let profilePictureUrl: string | undefined;
        
        if (req.file) {
            const publicId = `member_${Date.now()}_${Math.round(Math.random() * 1e6)}`
            const result = await uploadToCloudinary(req.file.buffer, publicId)
            profilePictureUrl = result.secure_url
          }

        const foundMember = await Member.findOne({ email })
        if(!foundMember){
            res.status(404).json({ message: "Member not found" })
            return
        } 

        const updateData: { [key: string]: any } = {
            firstName, lastName, phoneNumber, birthDate, github,
            gender, telegramHandle, graduationYear, specialization,
            department, universityId, instagramHandle, linkedinHandle,
            codeforcesHandle, leetcodeHandle, cv, bio, mentor,resources
        };
       
        if (profilePictureUrl) {
            updateData.profilePicture = profilePictureUrl
        }

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
 
export const getAllHeads = async (req: Request | any, res: Response): Promise<void> => {
    const { clubRole } = req.user
    const allowedRoles = ["President", "Vice President"]
    if(!allowedRoles.includes(clubRole)){
        res.status(403).json({message: `${clubRole} is not allowed to get division presidents.` })
        return
    } 
    try { 
      const heads = await Member.find({ clubRole: { $ne: "Member" } }).select("firstName middleName lastName clubRole email permissions permissionStatus");
  
      if (!heads || heads.length === 0) {
        res.status(400).json({ message: "No heads found" });
        return;
      }
      res.status(200).json({length:heads.length, heads });
    } catch (error) {
      res.status(500).json({ message: "Cannot get heads", error });
    }
  }; 

export const deleteMember = async(req: Request | any, res: Response): Promise<void> => {
    const { clubRole } = req.user
    if(clubRole === "Member"){
        res.status(403).json({message: `${clubRole} can not ban a member`})
        return
    }
    const id = req.params.id 
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(404).json({ message: `Invalid member ID: ${id}` });
        return;
    }
    const foundMember = await Member.findById(id)
    if(!foundMember){
        res.status(400).json({message: `No member found with ID: ${id}.`})
        return
    } 
    const division = foundMember.division
    if(await canManageDivision(clubRole, division)){
         try{
            foundMember.banned = true;
            foundMember.membershipStatus = 'Banned';
            await foundMember.save()
            res.status(200).json({
                message: `Member with ${id} id banned successfully.`
            })
        }
        catch(error){
            console.error('Error banning member:', error)
            res.status(500).json({ message: 'Internal server error' });
        }
    } else{
        res.status(403).json({message: `${clubRole} is not allowed to ban members in ${division}` })
    }
   
}
