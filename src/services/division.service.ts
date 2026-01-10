import { divisionGroupRepository } from "../repositories/divisionGroup.repository";
import { divisionRepository } from "../repositories/division.repository";
import { memberRepository } from "../repositories/member.repository";
import { getDivisions, invalidateDivisions } from "../utils/divisionCache";
import { ServiceError } from "../errors/ServiceError";

export const divisionService = {
  async listDivisions() {
    const divisions = await getDivisions();
    return { length: divisions.length, divisions };
  },

  async getGroups(division: string) {
    const availableDivisions = await getDivisions();
    if (!availableDivisions.includes(division)) {
      throw ServiceError.message(400, "Invalid division");
    }
    const divisionDocument = await divisionGroupRepository.findGroups(division);
    if (divisionDocument) {
      return {
        length: divisionDocument.groups.length,
        groups: divisionDocument.groups,
      };
    }
    return null;
  },

  async createDivision(actorClubRole: string, divisionName: string) {
    const allowedRoles = ["President", "Vice President"];
    if (!allowedRoles.includes(actorClubRole)) {
      throw ServiceError.message(403, `${actorClubRole} can not add a division`);
    }
    const newDivision = await divisionGroupRepository.create(divisionName);
    invalidateDivisions();
    await divisionRepository.createDivisionRecord(divisionName);
    return { message: "Division created successfully", division: newDivision };
  },

  async getDivisionMembers(division: string) {
    const availableDivisions = await getDivisions();
    if (!availableDivisions.includes(division)) {
      throw ServiceError.message(400, "Invalid division");
    }
    const divisionMembers = await memberRepository.findByDivision(division);
    return {
      length: divisionMembers.length,
      divisionMembers,
    };
  },

  async getDivisionSummary() {
    return divisionGroupRepository.divisionSummary();
  },
};
