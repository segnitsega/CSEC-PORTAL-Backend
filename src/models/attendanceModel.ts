import { Schema, model, Document, Types } from "mongoose";

export interface attendanceInterface extends Document {
  memberId: Types.ObjectId;
  sessionId: Types.ObjectId;
  status: "present" | "absent" | "excused";
  headsUp: string;
  date: Date;
}

const attendanceSchema = new Schema<attendanceInterface>({
  memberId: { type: Schema.Types.ObjectId, ref: "Member", required: true },
  sessionId: { type: Schema.Types.ObjectId, ref: "Session", required: true },
  status: {
    type: String,
    enum: ["present", "absent", "excused"],
    required: true,
  },
  headsUp: {type: String},
  date: { type: Date, default: Date.now },
}, { timestamps: true });

attendanceSchema.index({ memberId: 1, sessionId: 1 }, { unique: true });

export default model<attendanceInterface>("Attendance", attendanceSchema);
