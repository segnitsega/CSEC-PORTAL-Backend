"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const MONGO_URI = process.env.MONGO_URI || "";
const connectDB = async () => {
    let retry = 5;
    let delay = 5000;
    while (retry > 0) {
        try {
            await mongoose_1.default.connect(MONGO_URI);
            console.log('Mongodb connected.');
            return;
        }
        catch (error) {
            console.log('Mongodb not connected: ', error);
            retry--;
            if (retry === 0) {
                console.log('Mongodb connection failed after 5 attempts');
                process.exit(1);
            }
            console.log(`Retrying in ${delay / 1000} seconds...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2;
        }
    }
};
exports.connectDB = connectDB;
