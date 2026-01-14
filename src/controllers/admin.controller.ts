import { Response } from "express";
import { adminService } from "../services/admin.service";
import { handleServiceError } from "../errors/ServiceError";
import { AuthenticatedRequest } from "../types/express";

export const addNewRole = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const result = await adminService.assignNewRole(req.user!.clubRole, req.body);
    res.status(200).json(result);
  } catch (error) {
    if (handleServiceError(res, error)) return;
    console.error("Error assigning new role:", error);
    res.status(500).json({
      message: "Unable to assign new role.",
      error: error,
    });
  }
};

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

export const banMembers = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const result = await adminService.banMembers(req.user!.clubRole, req.body.emails);
    res.status(200).json(result);
  } catch (error) {
    if (handleServiceError(res, error)) return;
    console.error("Error banning members:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
