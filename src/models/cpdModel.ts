import { Schema, model, Document, Types } from 'mongoose';

export interface cpdInterface extends Document{
    member: Types.ObjectId;
    leetcodeHandle?: String;
    codeforcesHandle?: String;
    group: Number;
    // additional fields could be added..
}

const cpdSchema = new Schema<cpdInterface>({
    member: {type: Schema.Types.ObjectId, required: true, ref: "Member"},
    leetcodeHandle: {type: String },
    codeforcesHandle: {type: String },
    group: {type: Number, required: true}
})

export default model<cpdInterface>("CPD", cpdSchema); 