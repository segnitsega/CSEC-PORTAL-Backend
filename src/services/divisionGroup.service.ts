import { divisionGroupRepository } from "../repositories/divisionGroup.repository";
import { memberRepository } from "../repositories/member.repository";
import { canManageDivision } from "../utils/checkDivisionHead";
import { buildMemberSearchOr } from "../utils/search";
import { ServiceError } from "../errors/ServiceError";

export interface GroupMembersQuery {
  division?: string;
  group?: string;
  search?: unknown;
  campusStatus?: unknown;
  attendance?: unknown;
  membershipStatus?: unknown;
  page?: unknown;
  limit?: unknown;
}

export const divisionGroupService = {
  async createGroup(actorClubRole: string, group: string, division: string) {
    if (actorClubRole === "Member") {
      throw ServiceError.message(403, "Unauthorized to create a group");
    }
    if (await canManageDivision(actorClubRole, division)) {
      const newGroup = await divisionGroupRepository.addGroup(division, group);
      return { message: "New group created", group: newGroup };
    }
    throw ServiceError.message(
      403,
      `${actorClubRole} can not create a group in ${division}`
    );
  },

  async getGroupMembers(query: GroupMembersQuery) {
    const { division, group, search, campusStatus, attendance, membershipStatus } =
      query;

    const pageNumber = Math.max(1, parseInt(query.page as string, 10) || 1);
    const limitNumber = Math.max(1, parseInt(query.limit as string, 10) || 10);

    if (!group || !division) {
      throw ServiceError.message(400, "Group name and division required");
    }

    const mongoQuery: any = {
      division,
      group,
    };

    const searchOr = buildMemberSearchOr(search);
    if (searchOr) mongoQuery.$or = searchOr;

    if (campusStatus) mongoQuery.campusStatus = campusStatus;
    if (attendance) mongoQuery.attendance = attendance;
    if (membershipStatus) mongoQuery.membershipStatus = membershipStatus;

    const skip = (pageNumber - 1) * limitNumber;

    const groupExist = await divisionGroupRepository.findGroupInDivision(
      division,
      group
    );
    if (!groupExist) {
      throw ServiceError.message(
        400,
        `Group "${group}" does not exist in ${division}`
      );
    }

    const [groupMembers, total] = await memberRepository.findPaginated(
      mongoQuery,
      skip,
      limitNumber
    );

    return {
      currentPage: pageNumber,
      totalPages: Math.ceil(total / limitNumber),
      totalGroupMembers: total,
      groupMembers,
    };
  },
};
