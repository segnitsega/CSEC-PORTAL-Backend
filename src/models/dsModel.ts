import { Schema, model, Document, Types } from "mongoose";

export interface dsInterface extends Document {
  member: Types.ObjectId;
  kaggle?: string;
  leetcodeHandle?: string;
  codeforcesHandle?: string;
  techStack?: string[];        
  projects?: string[];        
  group: string;             
  researchArea?: string; // like NLP, CV, or any specialization of the member in Data science  
  publications?: string[];  
  // additional fields can be added 
}

const dsSchema = new Schema<dsInterface>({
  member: { type: Schema.Types.ObjectId, required: true, ref: "Member" },
  kaggle: { type: String },
  codeforcesHandle: { type: String, default: ""  },
  leetcodeHandle: { type: String, default: ""  },
  techStack: { type: [String] },
  projects: { type: [String] },
  group: { type: String, default: "Group 1" },
  researchArea: { type: String },
  publications: { type: [String] },
});

export default model<dsInterface>("DS", dsSchema);
