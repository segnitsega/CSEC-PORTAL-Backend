import { Schema, model, Document } from "mongoose";

export interface dsInterface extends Document {
  member_id: string;
  github?: string;
  kaggle?: string;
  techStack: string[];        
  projects: string[];        
  group?: number;             
  researchArea?: string; // like NLP, CV, or any specialization of the member in Data science  
  publications?: string[];  
  // additional fields can be added 
}

const dsSchema = new Schema<dsInterface>({
  member_id: { type: String, required: true, ref: "Member" },
  github: { type: String },
  kaggle: { type: String },
  techStack: { type: [String], required: true },
  projects: { type: [String], required: true },
  group: { type: Number },
  researchArea: { type: String },
  publications: { type: [String] },
});

export default model<dsInterface>("DS", dsSchema);
