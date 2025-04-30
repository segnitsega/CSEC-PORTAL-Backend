import express from "express";
import { addNewRole } from "../controllers/admin.controller";
import { authenticateToken } from "../middlewares/authMiddleware";

export const adminRouter = express.Router();

adminRouter.post("/heads", authenticateToken, addNewRole)