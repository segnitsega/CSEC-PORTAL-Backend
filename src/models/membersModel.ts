
import { Schema, model, Document } from 'mongoose';

// indexing later 
export interface memberInterface extends Document {
    firstName?: string;
    middleName?: string; 
    lastName?: string;
    phoneNumber?: string;
    email: string; 
    birthDate?: string,
    github?: string,
    leetcodeHandle?: string;
    codeforcesHandle?: string;
    gender?: string;
    telegramHandle?: string;
    graduationYear?: number;  
    specialization?: string;
    department?: string;
    mentor?: string; // do we need it actually?
    universityId?: string; 
    instagramHandle?: string;
    linkedinHandle?: string;
    cv?: string, 
    bio?: string, 
    resourceName?: string,
    resourceLink?: string,
    banned: boolean; 
    profilePicture?: string; 
    clubRole: string;
    division: string; 
    group: string;
    divisionRole: 'Admin' | 'Coordinator' | 'Member';
    membershipStatus: 'Active' | 'Alumni' | 'Banned';
    campusStatus: 'On Campus' | 'Off Campus' | 'Withdrawn';
    attendance: 'Active' | 'Inactive' | 'Needs Attention';
    password: string;
    mustChangePassword: boolean;
    refreshToken: string | null; 
    createdAt: Date;
    updatedAt: Date;
} 

const memberSchema = new Schema<memberInterface>({
    universityId: { type: String }, 
    firstName: { type: String, trim: true },
    middleName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    email: { type: String, unique: true, lowercase: true, trim: true, sparse: true},
    banned: { type: Boolean, default: false },
    telegramHandle: { type: String, trim: true },
    instagramHandle: { type: String, trim: true },
    linkedinHandle: { type: String, trim: true },
    phoneNumber: { type: String, trim: true },
    bio: { type: String },
    department: { type: String },
    mentor: { type: String },
    specialization: { type: String },
    github: { type: String }, 
    leetcodeHandle: { type: String }, 
    codeforcesHandle: { type: String }, 
    resourceName: { type: String },
    resourceLink: { type: String },
    birthDate: { type: String },
    graduationYear: { type: Number},
    cv: { type: String }, 
    profilePicture: { type: String },
    clubRole: { 
        type: String,
        default: 'Member'
    },
    division: {
        type: String,
        required: true,
        
    },
    group: {type: String, default: "Group 1"},
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
    attendance: {
        type: String,
        enum: ['Active', 'Inactive', 'Needs Attention'],
        default: 'Active'
    },
    password: { type: String },
    mustChangePassword: { type: Boolean, default: false },
    refreshToken: { type: String, default: null },

}, { timestamps: true });

export default model<memberInterface>('Member', memberSchema);
