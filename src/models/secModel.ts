import { Schema, model, Document } from "mongoose";

export interface secInterface extends Document {
  member_id: string;
  github?: string;
  tryhackme?: string;
  hackthebox?: string;
  certifications?: string[];              
  techStack: string[];            
  projects: string[];             
  tools?: string[];               
  specialization?: string;        
  //any additional field can be added
}

const secSchema = new Schema<secInterface>({
  member_id: { type: String, required: true, ref: "Member" },
  github: { type: String },
  tryhackme: { type: String },
  hackthebox: { type: String },
  certifications: { type: [String] },
  techStack: { type: [String], required: true },
  projects: { type: [String], required: true },
  tools: { type: [String] },
  specialization: { type: String },
});

export default model<secInterface>("SEC", secSchema);
