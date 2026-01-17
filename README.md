<div align="center">

# CSEC Community Portal — Backend

**The backend service powering the Computer Science & Engineering Club community portal.**

Member management, event & session scheduling, attendance tracking, and automated status lifecycles for a vibrant student tech community.

[![Node.js](https://img.shields.io/badge/Node.js-16%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-5.x-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4.4%2B-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](#license)

[API Docs](https://csec-portal-backend-1.onrender.com/api-docs/) · [Live Portal](https://csec-portal-frontend-forked.vercel.app/auth/login) · [Frontend Repo](https://github.com/fafiyusuf/csec_portal_frontend_forked)

</div>

---

## 📽️ Demo

<!-- Screen recording of the app goes here. -->
<!-- Drag & drop your video into this section on GitHub, or replace the line below with the embed/link. -->

> _A screen recording walkthrough of the portal will be added here soon._

---

## 📌 Overview

The CSEC Community Portal backend is a TypeScript + Express REST API that serves as the backbone of the club's operations. It manages members, the club's technical divisions, learning sessions, events, resources, and attendance — and keeps event and session statuses up to date automatically through scheduled jobs.

All time-based logic runs on **Africa/Addis_Ababa** time and is re-evaluated every minute, so the portal always reflects what is actually happening on the ground.

## ✨ Features

- **🔐 Authentication & RBAC** — JWT-based auth with refresh tokens and role-based access control (Admins, Division Heads, Members, and public endpoints).
- **🕒 Automated status lifecycles** — Cron jobs transition events (`planned → started → on-going → ended`) and recurring weekly sessions automatically, with a grace period and full timezone awareness.
- **👥 Member management** — Onboarding, profiles, roles, banning, and last-seen tracking.
- **🏛️ Division management** — Five technical divisions, each with its own groups, sessions, and resources.
- **📅 Events & sessions** — Create, schedule, and track one-off events and recurring weekly sessions.
- **✅ Attendance tracking** — Submit and monitor member participation per session/event.
- **📚 Resources & rules** — Share division resources and manage club rules.
- **📤 File uploads** — Profile pictures and assets stored via Cloudinary (Multer ingestion).
- **✉️ Email notifications** — Transactional emails through Nodemailer.
- **🧪 Validated config & input** — Environment variables and request payloads validated with Zod; fail-fast on misconfiguration.
- **📖 Interactive API docs** — Swagger UI served directly from the API.

## 🛠️ Tech Stack

| Category         | Technology                                   |
| ---------------- | -------------------------------------------- |
| Runtime          | Node.js (v16.20.1+)                           |
| Language         | TypeScript                                    |
| Framework        | Express 5                                     |
| Database         | MongoDB + Mongoose ODM                        |
| Authentication   | JSON Web Tokens (JWT)                         |
| Validation       | Zod                                           |
| Scheduling       | node-cron / cron                              |
| Time handling    | moment-timezone, dayjs                        |
| File storage     | Cloudinary + Multer                           |
| Email            | Nodemailer                                    |
| API docs         | Swagger (swagger-jsdoc + swagger-ui-express)  |
| Password hashing | bcrypt                                        |

## 🏗️ Architecture

The codebase follows a layered architecture for clear separation of concerns:

```
Routes → Controllers → Services → Repositories → Models (MongoDB)
```

```
src/
├── config/          # Env loading & Zod-validated configuration, DB, Cloudinary
├── controllers/     # HTTP request/response handlers
├── services/        # Business logic
├── repositories/    # Data-access layer (Mongoose queries)
├── models/          # Mongoose schema definitions
├── routes/          # API endpoint definitions
├── middlewares/     # Auth, validation, error handling, uploads
├── cron/            # Scheduled jobs (event & session status updaters)
├── swagger/         # Swagger/OpenAPI definitions per resource
├── errors/          # Custom error types
├── utils/           # Helpers (mailer, search, caching, asyncHandler)
├── types/           # Shared TypeScript declarations
├── seed.ts          # Database seed script
└── server.ts        # Application entry point
```

## 🔗 API Endpoints

All routes are prefixed with `/api`:

| Resource   | Base path         | Description                          |
| ---------- | ----------------- | ------------------------------------ |
| Members    | `/api/members`    | Member onboarding, profiles, roles   |
| Admin      | `/api/admin`      | Administrative operations            |
| Divisions  | `/api/divisions`  | Division management                  |
| Groups     | `/api/groups`     | Division groups                      |
| Sessions   | `/api/sessions`   | Recurring weekly learning sessions   |
| Events     | `/api/events`     | One-off events                       |
| Attendance | `/api/attendance` | Attendance submission & tracking     |
| Resources  | `/api/resources`  | Shared division resources            |
| Rules      | `/api/rules`      | Club rules                           |

> 📖 Full request/response schemas are available in the [Swagger UI](https://csec-portal-backend-1.onrender.com/api-docs/) and the [Postman collection](https://winter-meadow-976641.postman.co/workspace/My-Workspace~cc44312f-db84-4c6b-8e1c-7c915f5a023c/collection/38482859-f3f5f8d7-da7a-4e01-8ec5-e7c013a1f522?action=share&creator=38482859).

## ⏰ Scheduled Jobs

Both jobs run **every minute** on `Africa/Addis_Ababa` time:

1. **Event Status Updater** — Evaluates every event against the current time and advances it through `planned → started → on-going → ended`, including a 15-minute grace period after the start time.
2. **Session Status Updater** — Manages recurring weekly sessions, resolving status from the current day of week, day-specific time slots, and the session's overall start/end dates.

## 🌐 Division Structure

| Division                    | Focus                                                                  |
| --------------------------- | ---------------------------------------------------------------------- |
| **Competitive Programming** | Coding contests, DSA sessions, problem solving, interview prep         |
| **Development**             | Web/app bootcamps, open source, project collaboration, workshops       |
| **Cyber Security**          | CTF competitions, security workshops, ethical hacking                  |
| **Data Science**            | ML/AI workshops, data analysis, research, intro bootcamps              |
| **Capacity Building**       | Intro sessions for fresh students, seminars, competitions & fun events |

## 🚀 Getting Started

### Prerequisites

- **Node.js** v16.20.1 or higher
- **MongoDB** v4.4 or higher (local or Atlas)
- **npm** (bundled with Node.js)
- A **Cloudinary** account (file storage)
- **Email service credentials** (for Nodemailer)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/segnitsega/CSEC-PORTAL-Backend.git
   cd CSEC-PORTAL-Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your own values
   ```

4. **(Optional) Seed the database** with divisions, leadership accounts, and sample content:
   ```bash
   npm run seed
   ```
   > ⚠️ The seed script is destructive — it wipes the collections it manages before re-inserting. Only run it against a fresh or test cluster.

5. **Start the development server**
   ```bash
   npm run dev
   ```
   The API will be available at `http://localhost:3000` (or your configured `PORT`).

### Environment Variables

| Variable                | Required | Description                            |
| ----------------------- | :------: | -------------------------------------- |
| `MONGO_URI`             |    ✅    | MongoDB connection string              |
| `SECRET_KEY`            |    ✅    | Secret used for access-token signing   |
| `REFRESH_KEY`           |    ✅    | Secret used for refresh tokens         |
| `BACKEND_EMAIL`         |    ✅    | Sender email address for notifications |
| `EMAIL_PASS`            |    ✅    | Email app password                     |
| `CLOUDINARY_CLOUD_NAME` |    ✅    | Cloudinary cloud name                  |
| `CLOUDINARY_API_KEY`    |    ✅    | Cloudinary API key                     |
| `CLOUDINARY_API_SECRET` |    ✅    | Cloudinary API secret                  |
| `PORT`                  |    ❌    | Server port (defaults to `3000`)       |
| `CLIENT_URL`            |    ❌    | Allowed CORS origin (defaults to `*`)  |

### Available Scripts

| Script          | Description                                    |
| --------------- | ---------------------------------------------- |
| `npm run dev`   | Start the dev server with hot reload (nodemon) |
| `npm run build` | Compile TypeScript to `dist/`                  |
| `npm start`     | Run the compiled production build              |
| `npm run seed`  | Seed the database with sample data             |

## 📚 API Documentation

- **Swagger UI:** [csec-portal-backend-1.onrender.com/api-docs](https://csec-portal-backend-1.onrender.com/api-docs/)
- **Postman Collection:** [CSEC Portal API](https://winter-meadow-976641.postman.co/workspace/My-Workspace~cc44312f-db84-4c6b-8e1c-7c915f5a023c/collection/38482859-f3f5f8d7-da7a-4e01-8ec5-e7c013a1f522?action=share&creator=38482859)

## 🔗 Related Repositories

- **Frontend:** [csec_portal_frontend_forked](https://github.com/fafiyusuf/csec_portal_frontend_forked)

## 🤝 Contributing

Contributions are welcome! To propose a change:

1. Fork the repository
2. Create a feature branch — `git checkout -b feature/your-feature`
3. Commit your changes — `git commit -m "Add your feature"`
4. Push the branch — `git push origin feature/your-feature`
5. Open a Pull Request

## 👥 Team

| Name              | Role               | Contact                                      |
| ----------------- | ------------------ | -------------------------------------------- |
| Bereket Sahle     | Backend Team Lead  | bsahle95@gmail.com                           |
| Besufikad Michael | Frontend Team Lead | besumicheal@gmail.com                        |
| Segni Tsega       | Backend Developer  | [@segnitsega](https://github.com/segnitsega) |
| Habte Melese      | Backend Developer  | [@HabteMel](https://github.com/HabteMel)     |
| Fetiya Yusuf      | Frontend Developer | [@fafiyusuf](https://github.com/fafiyusuf)   |
| Lelo Mohammed     | Frontend Developer | [@lu00009](https://github.com/lu00009)       |

## ✉️ Contact

- **Maintainer:** Segni Tsega — segnitsega6@gmail.com
- **Community Portal:** [Live Portal](https://csec-portal-frontend-forked.vercel.app/auth/login)

## 📄 License

This project is licensed under the **ISC License**.

---

<div align="center">

⏰ _Perfectly timed code for a perfectly scheduled community._ ⏰

</div>
