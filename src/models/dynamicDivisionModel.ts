import mongoose from 'mongoose';

const divisionSchema = new mongoose.Schema({
  name: String,
  createdAt: { type: Date, default: Date.now },
});

export const getDivisionModel = (divisionName: string) => {
  const modelName = divisionName.replace(/\s+/g, '') + 'Model';
  return mongoose.models[modelName] || mongoose.model(modelName, divisionSchema, divisionName);
};
