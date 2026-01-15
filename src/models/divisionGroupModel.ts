import { Schema, model, Document } from 'mongoose';

export interface divisionGroupInterface extends Document {
    groups: string[];
    division: string;
    divisionHead: string;
}

const divisionGroupSchema = new Schema<divisionGroupInterface>({
  groups: { type: [String], default: ["Group 1"] },
  division: {
    type: String,
    unique: true,
    required: true
  },
  divisionHead: { type: String, default: "" },

}, { timestamps: true });


export default model<divisionGroupInterface>('DivisionGroup', divisionGroupSchema);
