import { memberRepository } from "../repositories/member.repository";
import { divisionRepository } from "../repositories/division.repository";
import { ServiceError } from "../errors/ServiceError";

const topRoles = ["President", "Vice President"];

export const adminService = {
  async assignNewRole(
    actorClubRole: string,
    body: { division?: string; name?: string; email?: string }
  ) {
    if (!topRoles.includes(actorClubRole)) {
      throw ServiceError.message(401, `${actorClubRole} can not assign new role`);
    }
    const { division, name, email } = body;

    await memberRepository.demoteDivisionPresident(division as string);
    await memberRepository.promoteToDivisionPresident(
      division as string,
      email as string
    );
    await divisionRepository.setDivisionHead(division as string, name as string);

    return {
      message: `${name} has been successfully assigned as ${division} President.`,
    };
  },

  async banMembers(actorClubRole: string, emails: unknown) {
    if (!topRoles.includes(actorClubRole)) {
      throw ServiceError.message(
        403,
        `${actorClubRole} is not allowed to ban members`
      );
    }
    if (!Array.isArray(emails) || emails.length === 0) {
      throw ServiceError.message(
        400,
        "Email list is required and must be an array."
      );
    }
    const result = await memberRepository.banByEmails(emails);
    return {
      message: `${result.modifiedCount} member(s) banned successfully.`,
      updatedCount: result.modifiedCount,
    };
  },
};
