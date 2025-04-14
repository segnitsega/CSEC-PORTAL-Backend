import { Schema, model, Document } from 'mongoose';

export interface divisionGroupInterface extends Document {
    group?: string; 
    // division: 'DEV' | 'CPD' | 'CBD' | 'DS' | 'SEC';
    division: string
}

const divisionGroupSchema = new Schema<divisionGroupInterface>({
  group: { type: String, default: "Group 1" },
  division: { 
    type: String, 
    required: true, 
    // enum: ['DEV', 'CPD', 'CBD', 'DS', 'SEC'] 
  },
  
}, { timestamps: true });


export default model<divisionGroupInterface>('DivisionGroup', divisionGroupSchema);
