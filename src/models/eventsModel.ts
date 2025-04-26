import { Schema, model, Document } from "mongoose";

export interface eventsInterface extends Document {
    eventTitle: string;
    division?: string;
    groups?: string[];
    eventDate: string;
    startTime: string;
    endTime: string;
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
    visibility: {type: String, required: true},
    attendance: {type: String, default: "Optional"}
}) 

export default model<eventsInterface>('Event', eventSchema) 