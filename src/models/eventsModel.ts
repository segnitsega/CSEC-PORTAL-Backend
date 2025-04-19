import { Schema, model, Document } from "mongoose";

export interface eventsInterface extends Document {
    eventTitle: string;
    eventDate: string;
    startTime: string;
    endTime: string;
    visibility: string
}

const eventSchema = new Schema<eventsInterface>({
    eventTitle: {type: String, required: true},
    eventDate: {type: String, required: true},
    startTime: {type: String, required: true},
    endTime: {type: String, required: true},
    visibility: {type: String, required: true},
}) 

export default model<eventsInterface>('Event', eventSchema)