import { Document, Schema, model } from "mongoose";

export interface resourcesInterface extends Document{
    resourceName: string;
    resourceLink: string;
    division: string;
}

const resourceSchema = new Schema<resourcesInterface>({
    resourceName: {type: String, required: true},
    resourceLink: {type: String, required: true},
    division: {type: String, required: true},
})

resourceSchema.index({ division: 1 });

export default model<resourcesInterface>("Resource", resourceSchema);