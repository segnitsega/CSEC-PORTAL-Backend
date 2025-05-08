import express from "express";
import { addNewRole, banMembers } from "../controllers/admin.controller";
import { authenticateToken } from "../middlewares/authMiddleware";
// import { validateAddPermissions } from "../middlewares/validatePermissions";
import { validateAddNewRole } from "../middlewares/validateNewRoleData";
import { validateEmailList } from "../middlewares/validateMembersBanRequest";
import { updateLastSeen } from "../middlewares/updateLastSeenMiddleware";

export const adminRouter = express.Router();

adminRouter.post("/heads", authenticateToken, updateLastSeen, validateAddNewRole, addNewRole) 
// adminRouter.post("/permissions", authenticateToken, validateAddPermissions, addPermissions)
adminRouter.post("/banMembers", authenticateToken, updateLastSeen, validateEmailList, banMembers) 