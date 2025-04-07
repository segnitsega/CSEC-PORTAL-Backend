import express from "express";
import { connectDB } from "./config/db";
import dotenv from "dotenv";
import { membersRouter } from "./routes/members.routes";
import cookieParser from "cookie-parser"

dotenv.config()

const server = express();
const PORT = process.env.PORT || 3000;

server.use(express.json())
server.use(cookieParser())
connectDB();

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

server.use('/api/members', membersRouter)
