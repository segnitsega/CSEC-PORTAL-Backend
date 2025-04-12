import { Schema, model, Document, Types } from "mongoose";

export interface devInterface extends Document{
    member: Types.ObjectId;
    leetcodeHandle?: string;
    codeforcesHandle?: string;
    techStack?: string[];
    projects?: string[];
    group: number;
    // additional fields could be added..
}

const devSchema = new Schema<devInterface>({
    member: { type: Schema.Types.ObjectId, required: true, ref: 'Member' },
    techStack: {type: [String] },
    projects: {type: [String] },
    leetcodeHandle: {type: String, default: ""  },
    codeforcesHandle: {type: String, default: ""  },
    group: { type: Number, default: 1 } 
    // additional fields could be added here too
    
}) 

export default model<devInterface>("DEV", devSchema) 