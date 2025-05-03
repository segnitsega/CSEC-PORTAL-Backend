import mongoose from "mongoose";

const clubRuleSchema = new mongoose.Schema({
  maxAbsences: { type: Number, required: true },
  warningAfter: { type: Number, required: true },
  suspendAfter: { type: Number, required: true },
  fireAfter: { type: Number, required: true },
  updatedAt: { type: Date, default: Date.now }
});

export const ClubRule = mongoose.model("ClubRule", clubRuleSchema);
