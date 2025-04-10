import express from "express"
import { getMembers } from "../controllers/members.controller"
import { handleLogin, handleRefreshToken, handleMemberOnboarding } from "../controllers/members.controller"
export const membersRouter = express.Router()

membersRouter.get('/', getMembers) 
membersRouter.post('/login', handleLogin) 
membersRouter.post('/refresh', handleRefreshToken) 
membersRouter.post('/createMember', handleMemberOnboarding)