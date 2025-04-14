
import express from "express"
import { getMembers } from "../controllers/members.controller"
import { handleLogin, handleRefreshToken, handleMemberOnboarding, handleProfileDetails, getMemberById } from "../controllers/members.controller"
import { validateMemberOnboarding } from "../middlewares/validateMemberOnboarding"
import { validateProfileDetails } from "../middlewares/validateProfileDetails"
import { authenticateToken } from "../middlewares/authMiddleware"
import { upload } from "../middlewares/upload"

export const membersRouter = express.Router()

membersRouter.get('/', authenticateToken, getMembers) 
membersRouter.get('/:id',authenticateToken, getMemberById) 
membersRouter.post('/login', handleLogin)    
membersRouter.post('/refresh', handleRefreshToken)
membersRouter.post('/createMember', validateMemberOnboarding, handleMemberOnboarding) 
membersRouter.post('/profileDetails',upload.single('profilePicture'),  validateProfileDetails, handleProfileDetails)  


