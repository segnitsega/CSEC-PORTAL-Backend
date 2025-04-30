import express from "express";
import { addNewRole, addPermissions } from "../controllers/admin.controller";
import { authenticateToken } from "../middlewares/authMiddleware";
import { validateAddPermissions } from "../middlewares/validatePermissions";
import { validateAddNewRole } from "../middlewares/validateNewRoleData";

export const adminRouter = express.Router();

adminRouter.post("/heads", authenticateToken, validateAddNewRole, addNewRole) 
adminRouter.post("/permissions", authenticateToken, validateAddPermissions, addPermissions)
