# 🚀 CSE Community Portal - Backend

Welcome to the backend repository of the Computer Science & Engineering Community Portal! This powerful Node.js application serves as the backbone for managing our vibrant student community, events, sessions, and various technical divisions.

# 🌟 Features

### 🕒 Automated Status Management

    * Real-time event tracking: Automatic status updates (planned → started → on-going → ended)

    * Session lifecycle management: Intelligent status transitions based on schedule

    * Timezone-aware: All operations use Addis Ababa time (Africa/Addis_Ababa)

    * Minute-by-minute checks: Cron jobs run every minute for maximum accuracy

### 🛡️ Authentication & Authorization

    * JWT-based authentication for secure access

    * Role-based access control with multiple privilege levels:

        * Admin (President/Vice President)

        * Division Heads (Competitive Programming, Development, Cyber Security, Data Science)

        * General Members

        * Public access for certain endpoints

### 🏛️ Core Functionalities

    * Member Management: Add, update, and track all student members

    * Event Management: Create, schedule, and manage technical events

    * Session Management: Organize and track learning sessions

    * Division Management: Handle all division-specific activities

    * Attendance Tracking: Monitor member participation

### 📂 Project Structure (MVC Architecture)
`
    backend/
    ├── config/          # Environment configurations
    ├── controllers/     # Business logic handlers
    ├── models/          # MongoDB schema definitions
    ├── routes/          # API endpoint definitions
    ├── middleware/      # Custom middleware (auth, validation)
    ├── utils/           # Helper functions and utilities
    ├── cron/            # Automated job schedulers
        ├── eventStatusUpdater.ts    # Event status management
        ├── sessionStatusUpdater.ts  # Session status management
    ├── .env.example     # Environment variables template
    ├── server.js        # Main application entry point
`

### 💻 Tech Stack

    * Runtime: Node.js

    * Framework: Express.js

    * Language: Typescript

    * Database: MongoDB (with Mongoose ODM)

    * Authentication: JSON Web Tokens (JWT)

    * Scheduling: node-cron

    * Time Handling: moment-timezone

    * API Documentation: Swagger

    *Other Libraries:

        * Bcrypt.js for password hashing

        * Zod for input sanitization and validation

        * Multer for file uploads

        * Nodemailer for email notifications

## 🕒 Cron Job Details

### 1. Event Status Updater

    * Frequency: Runs every minute

    * Functionality:

        * Checks all events against current time

        * Updates status through lifecycle stages:

            * planned → started → on-going → ended

        * Includes 15-minute grace period after start time

        * Handles timezone conversion automatically

### 2. Session Status Updater

    * Frequency: Runs every minute

    * Functionality:

        * Manages recurring weekly sessions

        * Handles day-specific time slots

        * Updates status based on:

            * Current day of week

            * Session time slots

            * Overall start/end dates

## Prerequisites:

Before you begin, ensure you have met the following requirements:
- **Node.js**: v16.20.1 or higher
- **MongoDB**: v4.4 or higher
- **npm**: Comes with Node.js
- **Cloudinary account** (for file storage)
- **Email service credentials** (for nodemailer)

## 🚀 Getting Started

### Installation

    1. Clone the repository
    
    `
        git clone https://github.com/segnitsega/CSEC-PORTAL-Backend.git

        cd CSEC-PORTAL-Backend
    `

    2. Install dependencies

    `
        npm install
    `

    3. Set up  environment variables

    `
        cp .env.example .env
        # Edit .env with your configurations

    `

    4. Start the development server

    `
        npm run dev
    `

## 📚 API Documentation

Explore the comprehensive API documentation:

    Swagger UI: http://localhost:3000/api-docs

    Postman Collection: [Link to Postman collection]


## 🌐 Division Structure

    1. Competitive Programming Division
        
        * Coding contests

        * Data structures and algorithms(DSA) learning sessions

        * Problem solving sessions

        * Interview preparation sessions

    2. Development Division

        * Web and app development bootcamps

        * Open source contributions

        * Project collaborations

        * Weekly workshop sessions

    3. Cyber Security Division

        * CTF competitions

        * Security workshops

        * Ethical hacking sessions

    4. Data Science Division

        * ML/AI workshops

        * Data analysis projects

        * Research collaborations

        * AI and Data Science introductory bootcamps
    
    5. Capacity Building Division

        * Preparing introductory learning sessions for fresh students

        * Organizing seminars

        * Hosting competition and fun events


## 🤝 Contributions

We welcome contributions from all members! Please follow these steps:

    1. Fork the repository

    2. Create your feature branch (git checkout -b feature/yourFeature)

    3. Commit your changes (git commit -m 'Add some AmazingFeature')

    4. Push to the branch (git push origin feature/AmazingFeature)

    5. Open a Pull Request

## ✉️ Contact

For any queries, please contact:

    * Project Maintainer: Segni Tsega

    * Email: segnitsega6@gmail.com

    * Community Portal: [Portal Link to be added]

<p align="center"> ⏰ Perfectly Timed Code for a Perfectly Scheduled Community! ⏰ </p>