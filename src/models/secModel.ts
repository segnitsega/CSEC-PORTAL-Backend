import { Schema, model, Document, Types } from "mongoose";

export interface secInterface extends Document {
  member: Types.ObjectId;
  codeforcesHandle?: string;
  leetcodeHandle?: string;
  tryhackme?: string;
  hackthebox?: string;
  certifications?: string[];              
  techStack?: string[];            
  projects?: string[];             
  tools?: string[];               
  specialization?: string;    
  group: string;    
  //any additional field can be added
}

const secSchema = new Schema<secInterface>({
  member: { type: Schema.Types.ObjectId, required: true, ref: "member" },
  codeforcesHandle: { type: String, default: ""},
  leetcodeHandle: { type: String, default: "" },
  tryhackme: { type: String },
  hackthebox: { type: String },
  certifications: { type: [String] },
  techStack: { type: [String] },
  projects: { type: [String] },
  tools: { type: [String] },
  specialization: { type: String },
  group: { type: String, default: "Group 1" } 

});

export default model<secInterface>("SEC", secSchema);
 