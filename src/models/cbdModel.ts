import { Schema, model, Document, Types } from "mongoose";

export interface cbdInterface extends Document {
  member: Types.ObjectId;
  eventsOrganized?: string[]; // tutors, seminars or any event organized by the member  
  responsibilities?: string[]; 
  codeforcesHandle?: string;
  leetcodeHandle?: string;
  group: number;
  // additional fields can be added too
}

const cbdSchema = new Schema<cbdInterface>({
  member: { type: Schema.Types.ObjectId, required: true, ref: "Member" },
  eventsOrganized: { type: [String] },
  responsibilities: { type: [String] },
  codeforcesHandle: { type: String },  
  leetcodeHandle: { type: String },  
  group: { type: Number, default: 1 } 

});

export default model<cbdInterface>("CBD", cbdSchema);
