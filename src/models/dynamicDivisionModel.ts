import mongoose from 'mongoose';

const divisionSchema = new mongoose.Schema({
  name: String,
  divisionHead: String,
  createdAt: { type: Date, default: Date.now },
});

export const getDivisionModel = (divisionName: string) => {
  const modelName = divisionName.toLowerCase().replace(/\s+/g, '') + 'Model';
  return mongoose.models[modelName] || mongoose.model(modelName, divisionSchema, divisionName.toLowerCase().replace(/\s+/g, '_'));
};


