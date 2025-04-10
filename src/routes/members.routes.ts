import express from "express"
import { handleLogin, handleRefreshToken, getMembers, getMemberById } from "../controllers/members.controller"
export const membersRouter = express.Router()

membersRouter.get('/', getMembers) 
membersRouter.get('/:id', getMemberById) 
membersRouter.post('/login', handleLogin) 
membersRouter.post('/refresh', handleRefreshToken) 