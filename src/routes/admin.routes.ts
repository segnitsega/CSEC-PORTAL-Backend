import express from "express";
import { addNewRole, addPermissions } from "../controllers/admin.controller";
import { authenticateToken } from "../middlewares/authMiddleware";
import { validateAddPermissions } from "../middlewares/validatePermissions";

export const adminRouter = express.Router();

adminRouter.post("/heads", authenticateToken, addNewRole)
adminRouter.post("/permissions", authenticateToken, validateAddPermissions, addPermissions)
