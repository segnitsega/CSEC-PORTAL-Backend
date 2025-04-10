
import { Schema, model, Document, Types } from 'mongoose';

export interface memberInterface extends Document {
    member_id: string; 
    firstName: string;
    middleName: string; 
    lastName: string;
    email: string; 
    telegramUsername: string;
    phoneNumber: string;
    year: string;  
    profilePicture: string; // for now I just considered a url for the profile image 
    clubRole: 'Member' | 'President' | 'Vice President' | 'CPD President' | 'Dev President' | 'CBD President' | 'SEC President' | 'DS President';
    division: 'CPD' | 'CBD' | 'DEV' | 'SEC' | 'DS'; 
    divisionRole: 'Admin' | 'Coordinator' | 'Member';
    membershipStatus: 'Active' | 'Alumni' | 'Banned';
    campusStatus: 'On Campus' | 'Off Campus' | 'Withdrawn';
    Attendance: 'Active' | 'Inactive' | 'Needs Attention'
    password: string;
    refreshToken: string | null; 
    createdAt: Date;
} 

const memberSchema = new Schema<memberInterface>({
    member_id: { type: String, required: true}, 
    firstName: { type: String, required: true, trim: true },
    middleName: { type: String, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    telegramUsername: { type: String, unique: true, trim: true },
    phoneNumber: { type: String, trim: true },
    year: { type: String},
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
    membershipStatus: {
        type: String,
        enum: ['Active', 'Alumni', 'Banned'],
        default: 'Active'
    }, 
    campusStatus: {
        type: String,
        enum: ['On Campus', 'Off Campus', 'Withdrawn'],
        default: 'On Campus'
    },
    Attendance: {
        type: String,
        enum: ['Active', 'Inactive', 'Needs Attention'],
        default: 'Active'
    },
    password: {type: String, required: true},
    refreshToken: {type: String, default: null},
    createdAt: { type: Date, default: Date.now }
});
export default model<memberInterface>('Member', memberSchema);
