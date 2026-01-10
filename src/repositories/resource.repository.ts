import Resource from "../models/resourcesModel";
import type { resourcesInterface } from "../models/resourcesModel";

export const resourceRepository = {
  create(data: Partial<resourcesInterface>) {
    return Resource.create(data);
  },

  findAll() {
    return Resource.find();
  },

  findById(id: string) {
    return Resource.findById(id);
  },

  deleteById(id: string) {
    return Resource.findByIdAndDelete(id);
  },

  updateById(id: string, update: Record<string, unknown>) {
    return Resource.findByIdAndUpdate(id, update, { new: true });
  },
};
