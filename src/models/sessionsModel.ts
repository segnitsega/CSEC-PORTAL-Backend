import { Schema, model, Document } from "mongoose";

export interface sessionsInterface extends Document {
    sessionTitle: string;
    division: string;
    groups: string[];
    startDate: string,
    endDate: string,
    status: "planned"| "started" | "ended" | "on-going";
    sessions: {
        day: string,
        startTime: string,
        endTime: string
    }[],
}

const sessionSchema = new Schema<sessionsInterface>({
  sessionTitle: {type: String, required: true, unique: true},
  division: {type: String, required: true},
  groups: {type: [String], required: true},
  startDate: {type: String, required: true},
  endDate: {type: String, required: true},
  status: {type: String, enum: ["planned", "started", "ended", "on-going"], default: "planned"},
  sessions: [
    {
      day: {type: String, required: true},
      startTime: {type: String, required: true},
      endTime: {type: String, required: true}
    }
  ],
}, { timestamps: true })

sessionSchema.index({ createdAt: -1 });
sessionSchema.index({ division: 1, status: 1 });

export default model<sessionsInterface>('Session', sessionSchema)