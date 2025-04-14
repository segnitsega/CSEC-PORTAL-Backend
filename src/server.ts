import express from "express";
import { connectDB } from "./config/db";
import dotenv from "dotenv";
import { membersRouter } from "./routes/members.routes";
import { groupsRouter } from "./routes/groups.routes";
import cookieParser from "cookie-parser"
import cors from "cors"
import { divisionsRouter } from "./routes/divisions.routes";

dotenv.config()

const server = express();
const PORT = process.env.PORT || 3000;

server.use(cors({
    origin: "*",
    credentials: true
}))
server.use(express.json())
server.use(cookieParser())
connectDB();

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

server.use('/api/members', membersRouter)
server.use('/api/groups', groupsRouter) 
server.use('/api/divisions', divisionsRouter) 