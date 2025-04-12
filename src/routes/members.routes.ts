import express from "express"
import { getMembers } from "../controllers/members.controller"
import { handleLogin, handleRefreshToken, handleMemberOnboarding, handleProfileDetails } from "../controllers/members.controller"
import { validateMemberOnboarding } from "../middlewares/validateMemberOnboarding"
import { validateProfileDetails } from "../middlewares/validateProfileDetails"
import { authenticateToken } from "../middlewares/authMiddleware"

export const membersRouter = express.Router()

membersRouter.get('/', authenticateToken, getMembers) 
membersRouter.post('/login', handleLogin) 
membersRouter.post('/refresh', handleRefreshToken) // its place??
membersRouter.post('/createMember', validateMemberOnboarding, handleMemberOnboarding) 
membersRouter.post('/profileDetails', validateProfileDetails, handleProfileDetails) 


