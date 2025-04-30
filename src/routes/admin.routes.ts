import express from "express";
import { addNewRole } from "../controllers/admin.controller";

export const adminRouter = express.Router();

adminRouter.post("/heads",addNewRole)