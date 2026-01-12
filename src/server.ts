import { config } from "./config";
import express from "express";
import { connectDB } from "./config/db";
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
import { startSessionStatusUpdater } from "./cron/sessionStatusUpdater"
import { startEventStatusUpdater } from "./cron/eventStatusUpdater"
import swaggerUi from "swagger-ui-express"
import { swaggerSpec, swaggerUiOptions } from "./utils/swagger";
import { notFoundHandler, errorHandler } from "./middlewares/errorHandler";

const server = express();
const PORT = config.PORT;
const origin = config.CLIENT_URL;

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

server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

server.use(notFoundHandler);
server.use(errorHandler);

const startServer = async () => {
    await connectDB();

    startSessionStatusUpdater();
    startEventStatusUpdater();

    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })
};

startServer().catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
});