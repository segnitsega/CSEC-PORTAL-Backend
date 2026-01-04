import { Schema, model, Document } from "mongoose";

export interface eventsInterface extends Document {
    eventTitle: string;
    division?: string;
    groups?: string[];
    eventDate: string;
    startTime: string;
    endTime: string;
    status: "planned" | "started" | "on-going" | "ended";
    visibility: string;
    attendance?: string;
}

const eventSchema = new Schema<eventsInterface>({
    eventTitle: {type: String, required: true},
    division: {type: String},
    groups: {type: [String], default: undefined},
    eventDate: {type: String, required: true},
    startTime: {type: String, required: true},
    endTime: {type: String, required: true},
    status: {type: String, enum: ["planned", "started", "on-going", "ended"], default: "planned"},
    visibility: {type: String, required: true},
    attendance: {type: String, default: "Optional"}
}, { timestamps: true })


eventSchema.index({ createdAt: -1 });
eventSchema.index({ status: 1 });

export default model<eventsInterface>('Event', eventSchema)