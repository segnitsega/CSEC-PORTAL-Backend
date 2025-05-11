import express from "express";
import { connectDB } from "./config/db";
import dotenv from "dotenv";
import { membersRouter } from "./routes/members.routes";
import { groupsRouter } from "./routes/groups.routes";
import cors from "cors"
import { divisionsRouter } from "./routes/divisions.routes";
import { sessionsRouter } from "./routes/sessions.routes";
import { eventsRouter } from "./routes/events.routes";
import attendanceRouter from "./routes/attendance.routes";
import { resourcesRouter } from "./routes/resources.routes";
import { adminRouter } from "./routes/admin.routes";
import { rulesRouter } from "./routes/rules.routes";
import "./cron/sessionStatusUpdater"
import "./cron/eventStatusUpdater"

dotenv.config()

const server = express();
const PORT = process.env.PORT || 3000;
const origin = process.env.CLIENT_URL;

server.use(cors({
    origin: origin,
}))

server.use(express.json())
server.use('/api/members', membersRouter) 
server.use('/api/divisions', divisionsRouter)  
server.use('/api/groups', groupsRouter) 
server.use('/api/sessions', sessionsRouter)
server.use('/api/events', eventsRouter)
server.use('/api/attendance', attendanceRouter) 
server.use('/api/resources', resourcesRouter)
server.use('/api/admin', adminRouter)
server.use('/api/rules', rulesRouter)

connectDB();

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})