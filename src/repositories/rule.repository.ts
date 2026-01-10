import { ClubRule } from "../models/clubRulesModel";

export const ruleRepository = {
  findOne() {
    return ClubRule.findOne();
  },

  upsert(update: Record<string, unknown>) {
    return ClubRule.findOneAndUpdate({}, update, { new: true, upsert: true });
  },
};
