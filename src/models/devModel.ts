import { Schema, model, Document } from "mongoose";

export interface devInterface extends Document{
    member_id: string;
    github: string;
    leetcode?: string;
    codeforces?: string;
    techStack: string[];
    projects: string[];
    // additional fields could be added..
}

const devSchema = new Schema<devInterface>({
    member_id: {type: String, required: true, ref: "Member"},
    techStack: {type: [String], required: true},
    projects: {type: [String], required: true},
    github: {type: String, required: true},
    leetcode: {type: String, required: true},
    codeforces: {type: String, required: true} 
    // additional fields could be added here too
    
}) 

export default model<devInterface>("DEV", devSchema) 