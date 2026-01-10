import Session from "../models/sessionsModel";
import type { sessionsInterface } from "../models/sessionsModel";

export const sessionRepository = {
  create(data: Partial<sessionsInterface>) {
    return Session.create(data);
  },

  findById(id: string) {
    return Session.findById(id);
  },

  findPaginated(skip: number, limit: number) {
    return Promise.all([
      Session.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
      Session.countDocuments(),
    ]);
  },

  updateById(id: string, update: Record<string, unknown>) {
    return Session.findByIdAndUpdate(id, update, { new: true });
  },
};
