import { getDivisionModel } from "../models/dynamicDivisionModel";

export const divisionRepository = {
  async createDivisionRecord(divisionName: string) {
    const Division = await getDivisionModel(divisionName);
    return Division.create({ name: divisionName });
  },

  async setDivisionHead(division: string, name: string) {
    const Division = await getDivisionModel(division);
    return Division.findOneAndUpdate(
      { name: division },
      { $set: { divisionHead: name } }
    );
  },
};
