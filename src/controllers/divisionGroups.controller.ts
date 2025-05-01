import { Request, Response } from "express"
import DivisionGroup from "../models/divisionGroupModel"
import Member from "../models/membersModel"

export const createGroup = async(req: Request | any, res: Response): Promise<void> => {
    const {clubRole} = req.user 
    if(clubRole === "Member"){
        res.status(403).json({message: "Unauthorized to create a group"})
        return;
    }  
    const {group, division} = req.body    

    const availableDivisions = await DivisionGroup.distinct('division'); 
    const topRoles = ["President", "Vice President"]

    const divisionPresidents:{[key: string]: string} = {}
    availableDivisions.forEach((division) => {
        divisionPresidents[`${division} President`] = division
    })    

    if (topRoles.includes(clubRole) || divisionPresidents[clubRole] === division) {       
        try {  
            const newGroup = await DivisionGroup.updateOne(
                { division },
                { $addToSet: { groups: group } }
              );
              
            res.status(201).json({ message: "New group created", group: newGroup });

        } catch (error) {
            console.error("Error creating group:", error);
            res.status(500).json({ message: "Failed to create group", error });
        }
    } else { 
        res.status(403).json({ message: `${clubRole} cannot create a group in ${division} division` });
    }
} 

export const getGroupMembers = async(req: Request | any, res: Response): Promise<void> => {
    
    const {
        division, 
        group, 
        search, 
        campusStatus, 
        attendance, 
        membershipStatus
    } = req.query

    const pageNumber = Math.max(1, parseInt(req.query.page as string, 10) || 1)
    const limitNumber = Math.max(1, parseInt(req.query.limit as string, 10) || 10)

    if(!group || !division){
        res.status(400).json({ message: "Group name and division required" })  
        return;
    }  
    const query: any = {
        division: division,
        group: group
    };

    if (search) {
        const regex = new RegExp(search as string, 'i'); 
        query.$or = [
          { firstName: regex },
          { middleName: regex },
          { lastName: regex },
          { email: regex },
          { universityId: regex }
        ];
      }

      if (campusStatus) query.campusStatus = campusStatus;
      if (attendance) query.attendance = attendance;
      if (membershipStatus) query.membershipStatus = membershipStatus;

      const skip = (pageNumber - 1) * limitNumber;

    const groupExist = await DivisionGroup.findOne({ groups: group, division}) 
    if(!groupExist){
        res.status(400).json({ message: `Group "${group}" does not exist in ${division}`})  
        return;
    }   
    try{
        const [groupMembers, total] = await Promise.all([
            Member.find(query)
            .select("-password -refreshToken")
            .skip(skip)
            .limit(limitNumber)
            .sort({createdAt: -1}),
            Member.countDocuments(query)
        ])
        res.status(200).json({ 
            currentPage: pageNumber, 
            totalPages: Math.ceil(total / limitNumber),
            totalGroupMembers: total,
            groupMembers: groupMembers });

    }catch (error) {
        console.error("Error fetching group members:", error);
        res.status(500).json({ message: "Failed to fetch members", error });
      }
    
} 
