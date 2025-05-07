import mongoose from 'mongoose';
import DivisionGroup from './divisionGroupModel';

const divisionSchema = new mongoose.Schema({
  name: String,
  divisionHead: String || "",
  createdAt: { type: Date, default: Date.now },
});

export const getDivisionModel = async(divisionName: string) => {
  const modelName = divisionName.toLowerCase().replace(/\s+/g, '') + 'Model';

  const validDivision = await DivisionGroup.findOne({ division: divisionName });
  if (!validDivision) {
    throw new Error(`Division "${divisionName}" is not valid.`);
  }

  return mongoose.models[modelName] || mongoose.model(modelName, divisionSchema, divisionName.toLowerCase().replace(/\s+/g, '_'));
};


