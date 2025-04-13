import { Schema, model, Document } from 'mongoose';

export interface divisionGroupInterface extends Document {
    group: string; 
    division: 'DEV' | 'CPD' | 'CBD' | 'DS' | 'SEC';
}

const divisionGroupSchema = new Schema<divisionGroupInterface>({
  group: { type: String, required: true },
  division: { 
    type: String, 
    required: true, 
    enum: ['DEV', 'CPD', 'CBD', 'DS', 'SEC'] 
  }
}, { timestamps: true });


export default model<divisionGroupInterface>('DivisionGroup', divisionGroupSchema);
