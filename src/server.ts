import express from "express";
import { connectDB } from "./config/db";
import dotenv from "dotenv";

dotenv.config()

const server = express();
const PORT = process.env.PORT || 3000;

server.use(express.json())
connectDB();

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

