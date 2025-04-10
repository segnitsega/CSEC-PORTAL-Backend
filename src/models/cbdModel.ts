import { Schema, model, Document } from "mongoose";

export interface cbdInterface extends Document {
  member_id: string;
  eventsOrganized: string[]; // tutors, seminars or any event organized by the member  
  responsibilities?: string[]; 
  // additional fields can be added too
}

const cbdSchema = new Schema<cbdInterface>({
  member_id: { type: String, required: true, ref: "Member" },
  eventsOrganized: { type: [String], required: true },
  responsibilities: { type: [String] },
});

export default model<cbdInterface>("CBD", cbdSchema);
