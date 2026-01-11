import mongoose from "mongoose";
import { GridFSBucket } from "mongodb";
import { config } from "./index";

const MONGO_URI = config.MONGO_URI;
export let gfsBucket: GridFSBucket;
export const connectDB = async() => {
    let retry = 5
    let delay = 5000
    while(retry > 0){
        try{ 
            await mongoose.connect(MONGO_URI);
            console.log('Mongodb connected.')
            return
        } 
        catch(error){
            console.log('Mongodb not connected: ', error)
            retry --
            if (retry === 0) { 
                console.log('Mongodb connection failed after 5 attempts');
                process.exit(1);
            }
            console.log(`Retrying in ${delay / 1000} seconds...`);
            await new Promise(resolve => setTimeout(resolve, delay)); 
            delay *= 2;
        }
    }
    
} 
