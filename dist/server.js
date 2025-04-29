"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("./config/db");
const dotenv_1 = __importDefault(require("dotenv"));
const members_routes_1 = require("./routes/members.routes");
const groups_routes_1 = require("./routes/groups.routes");
// import cookieParser from "cookie-parser"
const cors_1 = __importDefault(require("cors"));
const divisions_routes_1 = require("./routes/divisions.routes");
const sessions_routes_1 = require("./routes/sessions.routes");
const events_routes_1 = require("./routes/events.routes");
const attendance_routes_1 = __importDefault(require("./routes/attendance.routes"));
const resources_routes_1 = require("./routes/resources.routes");
const admin_routes_1 = require("./routes/admin.routes");
dotenv_1.default.config();
const server = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
server.use((0, cors_1.default)({
    origin: "*",
    credentials: true
}));
server.use('/uploads', express_1.default.static('uploads'));
server.use(express_1.default.json());
// server.use(cookieParser())
server.use('/api/members', members_routes_1.membersRouter);
server.use('/api/divisions', divisions_routes_1.divisionsRouter);
server.use('/api/groups', groups_routes_1.groupsRouter);
server.use('/api/sessions', sessions_routes_1.sessionsRouter);
server.use('/api/events', events_routes_1.eventsRouter);
server.use('/api/attendance', attendance_routes_1.default);
server.use('/api/resources', resources_routes_1.resourcesRouter);
server.use('/api/admin', admin_routes_1.adminRouter);
(0, db_1.connectDB)();
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
