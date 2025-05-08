
import express from "express"
import { getAllHeads, getMembers, handleLogin, handleRefreshToken, handleMemberOnboarding, handleProfileDetails, getMemberById, deleteMember } from "../controllers/members.controller"
import { validateMemberOnboarding } from "../middlewares/validateMemberOnboarding"
import { validateProfileDetails } from "../middlewares/validateProfileDetails"
import { authenticateToken } from "../middlewares/authMiddleware"
import { upload } from "../middlewares/profilePictureuploadMiddleware"
import { updateLastSeen } from "../middlewares/updateLastSeenMiddleware"

export const membersRouter = express.Router()

membersRouter.get('/', authenticateToken, updateLastSeen, getMembers) 
membersRouter.get('/heads', authenticateToken, updateLastSeen, getAllHeads)
membersRouter.post('/login', handleLogin)    
membersRouter.post('/refresh', handleRefreshToken) 
membersRouter.post('/createMember', authenticateToken, updateLastSeen, validateMemberOnboarding, handleMemberOnboarding) 
membersRouter.post('/profileDetails', authenticateToken, updateLastSeen, upload.single('profilePicture'),  validateProfileDetails, handleProfileDetails) 
membersRouter.get('/:id',authenticateToken, updateLastSeen, getMemberById) 
membersRouter.delete('/:id',authenticateToken, updateLastSeen,  deleteMember) 
