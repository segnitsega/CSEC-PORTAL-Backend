
import { Schema, model, Document } from 'mongoose';

export interface memberInterface extends Document {
    user_id: string; // if id is the student id, if not we can use Types.ObjectId of mongoose.
    firstName: string;
    middleName: string;
    lastName: string;
    email: string; 
    telegramUsername: string;
    phoneNumber: string;
    year: number; // might be string like 3rd, 4th...
    profilePicture: string; // for now I just considered a url for the profile image 
    clubRole: 'Member' | 'President' | 'Vice President' | 'CPD President' | 'Dev President' | 'CBD President' | 'SEC President' | 'DS President';
    division: 'CPD' | 'CBD' | 'DEV' | 'SEC' | 'DS';
    divisionRole: 'Admin' | 'Coordinator' | 'Member';
    status: 'Active' | 'Alumni' | 'Banned';
    createdAt: Date;
} 

const memberSchema = new Schema<memberInterface>({
    user_id: { type: String, required: true, unique: true },
    firstName: { type: String, required: true, trim: true },
    middleName: { type: String, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    telegramUsername: { type: String, trim: true },
    phoneNumber: { type: String, trim: true },
    year: { type: Number, required: true },
    profilePicture: { type: String },
    clubRole: {
        type: String,
        enum: ['Member', 'President', 'Vice President', 'CPD President', 'Dev President', 'CBD President', 'SEC President', 'DS President'],
        default: 'Member'
    },
    division: {
        type: String,
        enum: ['CPD', 'CBD', 'DEV', 'SEC', 'DS'],
        required: true
    },
    divisionRole: {
        type: String,
        enum: ['Admin', 'Coordinator', 'Member'],
        default: 'Member'
    },
    status: {
        type: String,
        enum: ['Active', 'Alumni', 'Banned'],
        default: 'Active'
    }, 
    createdAt: { type: Date, default: Date.now }
});

export default model<memberInterface>('Member', memberSchema);
