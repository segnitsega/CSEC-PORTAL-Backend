import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware";
import { addRules, getRules } from "../controllers/rules.controller";
import { validateClubRules } from "../middlewares/rulesMiddleware";

export const rulesRouter = express.Router();

rulesRouter.get("/", authenticateToken, getRules)
rulesRouter.put("/", authenticateToken, validateClubRules, addRules);
