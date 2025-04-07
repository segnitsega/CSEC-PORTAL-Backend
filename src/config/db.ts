
import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config()
const MONGO_URI = process.env.MONGO_URI || "";

export const connectDB = async() => {
    try{
        await mongoose.connect(MONGO_URI);
        console.log('Mongodb connected.')
    }
    catch(error){
        console.log('Mongodb not connected: ', error)
        process.exit(1);
    }
}