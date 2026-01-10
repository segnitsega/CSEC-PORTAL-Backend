import Event from "../models/eventsModel";
import type { eventsInterface } from "../models/eventsModel";

export const eventRepository = {
  create(data: Partial<eventsInterface>) {
    return Event.create(data);
  },

  findById(id: string) {
    return Event.findById(id);
  },

  findPaginated(skip: number, limit: number) {
    return Promise.all([
      Event.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
      Event.countDocuments(),
    ]);
  },

  deleteById(id: string) {
    return Event.findByIdAndDelete(id);
  },

  updateById(id: string, update: Record<string, unknown>) {
    return Event.findByIdAndUpdate(id, update, { new: true });
  },
};
