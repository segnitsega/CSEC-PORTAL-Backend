
import express from "express"
import { getAllHeads, getMembers, handleLogin, handleRefreshToken, handleMemberOnboarding, handleProfileDetails, getMemberById } from "../controllers/members.controller"
import { validateMemberOnboarding } from "../middlewares/validateMemberOnboarding"
import { validateProfileDetails } from "../middlewares/validateProfileDetails"
import { authenticateToken } from "../middlewares/authMiddleware"
import { upload } from "../middlewares/profilePictureuploadMiddleware"

export const membersRouter = express.Router()

membersRouter.get('/', authenticateToken, getMembers) 
membersRouter.get('/:id',authenticateToken, getMemberById) 
membersRouter.get('/heads', authenticateToken, getAllHeads)
membersRouter.post('/login', handleLogin)    
membersRouter.post('/refresh', handleRefreshToken) 
membersRouter.post('/createMember', authenticateToken, validateMemberOnboarding, handleMemberOnboarding) 
membersRouter.post('/profileDetails', authenticateToken, upload.single('profilePicture'),  validateProfileDetails, handleProfileDetails)  