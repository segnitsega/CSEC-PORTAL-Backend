import { Schema, model, Document } from 'mongoose';

export interface cpdInterface extends Document{
    member_id: String;
    leetcode: String;
    codeforces: String;
    techStack: String[];
    github: String;
    group: Number;
    // additional fields could be added..

}

const cpdSchema = new Schema<cpdInterface>({
    member_id: {type: String, required: true, ref: "Member"},
    leetcode: {type: String, required: true},
    codeforces: {type: String, required: true},
    techStack: {type: [String], required: true},
    github: {type: String, required: true},
    group: {type: Number, required: true}
})

export default model<cpdInterface>("CPD", cpdSchema); 