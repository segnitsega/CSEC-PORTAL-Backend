import { Schema, model, Document } from "mongoose";

export interface sessionsInterface extends Document {
    sessionTitle: string;
    division: string;
    groups: string[];
    startDate: string,
    endDate: string,
    sessions: {
        day: string,
        startTime: string,
        endTime: string
    }[],
    status: string;
}

const sessionSchema = new Schema<sessionsInterface>({
  sessionTitle: {type: String, required: true, unique: true},
  division: {type: String, required: true},
  groups: {type: [String], required: true},
  startDate: {type: String, required: true},
  endDate: {type: String, required: true},
  sessions: [
    {
      day: {type: String, required: true},
      startTime: {type: String, required: true},
      endTime: {type: String, required: true}
    }
  ],
  status: {type: String, default: "Planned"}
})

export default model<sessionsInterface>('Session', sessionSchema)