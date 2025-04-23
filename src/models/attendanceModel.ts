import { Schema, model, Document, Types } from "mongoose";

export interface attendanceInterface extends Document {
  memberId: Types.ObjectId;
  sessionId: Types.ObjectId;
  status: "Present" | "Absent" | "Excused";
  headsUp: string;
  date: Date;
}

const attendanceSchema = new Schema<attendanceInterface>({
  memberId: { type: Schema.Types.ObjectId, ref: "Member", required: true },
  sessionId: { type: Schema.Types.ObjectId, ref: "Session", required: true },
  status: {
    type: String,
    enum: ["Present", "Absent", "Excused"],
    required: true,
  },
  headsUp: {type: String},
  date: { type: Date, default: Date.now },
}, { timestamps: true });

export default model<attendanceInterface>("Attendance", attendanceSchema);
