import { ruleRepository } from "../repositories/rule.repository";
import { ServiceError } from "../errors/ServiceError";

export const ruleService = {
  async getRules() {
    const rules = await ruleRepository.findOne();
    if (!rules) {
      throw ServiceError.message(404, "No rules found");
    }
    return { ClubRules: rules };
  },

  async addRules(actorClubRole: string, body: Record<string, unknown>) {
    const allowedRoles = ["President", "Vice President"];
    if (!allowedRoles.includes(actorClubRole)) {
      throw ServiceError.message(
        403,
        `${actorClubRole} is not authorized to add rules`
      );
    }
    const update = { ...body, updatedAt: new Date() };
    const rules = await ruleRepository.upsert(update);
    return rules;
  },
};
