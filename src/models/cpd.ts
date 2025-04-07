
import { Schema, model, Document } from 'mongoose';

export interface cpdInterface extends Document{
    user_id: String;
    leetcode: String;
    codeforces: String;
    techStack: String[];
    group: Number
    // additional fields could be added..

}

const cpdSchema = new Schema<cpdInterface>({
    user_id: {type: String, required: true, ref: "Member"},
    leetcode: {type: String, required: true},
    codeforces: {type: String, required: true},
    techStack: {type: [String], required: true},
    group: {type: Number, required: true}
    // additional fields could be added here too
})

export default model<cpdInterface>("CPD", cpdSchema);