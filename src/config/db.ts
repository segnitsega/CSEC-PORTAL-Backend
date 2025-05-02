import mongoose from "mongoose";
import { GridFSBucket } from "mongodb";
import dotenv from "dotenv"

dotenv.config()
const MONGO_URI = process.env.MONGO_URI || "";
export let gfsBucket: GridFSBucket;
export const connectDB = async() => {
    let retry = 5
    let delay = 5000
    while(retry > 0){
        try{ 
            await mongoose.connect(MONGO_URI);
            console.log('Mongodb connected.')

            gfsBucket = new GridFSBucket(mongoose.connection.db!, {
                bucketName: 'profilePics' // → creates profilePics.files & profilePics.chunks
            });
              console.log(' GridFSBucket profilePics is ready.');
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
