import { Document, Schema, model } from "mongoose";

export interface resourcesInterface extends Document{
    resourceName: string;
    resourceLink: string;

}

const resourceSchema = new Schema<resourcesInterface>({
    resourceName: {type: String, required: true},
    resourceLink: {type: String, required: true},

})

export default model<resourcesInterface>("Resource", resourceSchema);