import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware";
import { addRules, getRules } from "../controllers/rules.controller";
import { validateClubRules } from "../middlewares/rulesMiddleware";
import { updateLastSeen } from "../middlewares/updateLastSeenMiddleware";

export const rulesRouter = express.Router();

rulesRouter.get("/", authenticateToken, updateLastSeen, getRules)
rulesRouter.put("/", authenticateToken, updateLastSeen, validateClubRules, addRules);
