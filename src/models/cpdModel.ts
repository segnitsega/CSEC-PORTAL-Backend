import { Schema, model, Document, Types } from 'mongoose';

export interface cpdInterface extends Document{
    member: Types.ObjectId;
    leetcodeHandle?: String;
    codeforcesHandle?: String;
    group: string;
    // additional fields could be added..
}

const cpdSchema = new Schema<cpdInterface>({
    member: {type: Schema.Types.ObjectId, required: true, ref: "Member"},
    leetcodeHandle: {type: String, default: ""  },
    codeforcesHandle: {type: String, default: ""  },
    group: { type: String, default: "Group 1" } 

})

export default model<cpdInterface>("CPD", cpdSchema); 