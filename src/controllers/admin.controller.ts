
import { Request, Response } from "express"
import Member from "../models/membersModel"
import { getDivisionModel } from "../models/dynamicDivisionModel";

export const addNewRole = async (req: Request | any,res:Response): Promise<void>=> {
   
    const {clubRole} = req.user
    const topRoles = ["President", "Vice President"]

    if(!topRoles.includes(clubRole)){
        res.status(401).json({message: `${clubRole} can not assign new role`})
        return
    } 
    try{
        const { division, name, email } = req.body;
        await Member.findOneAndUpdate(
            { clubRole: division + " " + "President" }, 
            { $set:{ clubRole: "Member" } }
        )
        
        await Member.findOneAndUpdate(
            { email }, 
            { $set:{clubRole: division + " " + "President" } }
        )      

        const Division = await getDivisionModel(division)
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

// export const addPermissions = async (req: Request | any,res:Response): Promise<void> => {
//     const {clubRole} = req.user
//     const topRoles = ["President", "Vice President"]

//     if(!topRoles.includes(clubRole)){
//         res.status(401).json({message: `${clubRole} can not add permissions`})
//         return
//     } 
//     const { role, permissions, permissionStatus } = req.body;
    
// try{
//     await Member.findOneAndUpdate(
//         { clubRole: role },
//         {
//           $set: {
//             permissions: permissions,
//             permissionStatus: permissionStatus,
//           },
//         },
//         { new: true, collation: { locale: "en", strength: 2 } }
//       ); 
//     res.status(200).json({
//         message: `Permissions updated for ${role}.`,
//         permissions: permissions,
//         permissionStatus: permissionStatus,
//       });
// }catch (err) {
//     console.error("Error updating permissions:", err);
//     res.status(500).json({
//       message: "Failed to update permissions.",
//       error: err instanceof Error ? err.message : err,
//     });
//   }

// }

export const banMembers = async(req: Request | any, res: Response): Promise<void> => {
    const { clubRole } = req.user
    const allowedRoles = ["President", "Vice President"]
    if(!allowedRoles.includes(clubRole)){
        res.status(403).json({message: `${clubRole} is not allowed to ban members` })
        return
    } 
  try {
    const { emails } = req.body;

    if (!Array.isArray(emails) || emails.length === 0) {
        res.status(400).json({ message: 'Email list is required and must be an array.' });
        return
    }
    const result = await Member.updateMany(
      { email: { $in: emails } },
      { $set: { banned: true, membershipStatus: 'Banned' } }
    );
    res.status(200).json({
      message: `${result.modifiedCount} member(s) banned successfully.`,
      updatedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Error banning members:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


