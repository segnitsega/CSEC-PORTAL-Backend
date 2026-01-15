import DivisionGroup from "../models/divisionGroupModel";
import Member from "../models/membersModel";

export const divisionGroupRepository = {
  create(division: string) {
    return DivisionGroup.create({ division });
  },

  findGroups(division: string) {
    return DivisionGroup.findOne({ division }).select("groups");
  },

  addGroup(division: string, group: string) {
    return DivisionGroup.updateOne({ division }, { $addToSet: { groups: group } });
  },

  findGroupInDivision(division: string, group: string) {
    return DivisionGroup.findOne({ groups: group, division });
  },

  setDivisionHead(division: string, name: string) {
    return DivisionGroup.updateOne({ division }, { $set: { divisionHead: name } });
  },

  divisionSummary() {
    return DivisionGroup.aggregate([
      {
        $lookup: {
          from: Member.collection.name,
          let: { division: "$division" },
          pipeline: [
            { $match: { $expr: { $eq: ["$division", "$$division"] } } },
            { $sort: { createdAt: -1 } },
            { $project: { password: 0, refreshToken: 0 } },
          ],
          as: "divisionMembers",
        },
      },
      {
        $project: {
          _id: 0,
          division: 1,
          groupCount: { $size: "$groups" },
          groups: {
            $map: {
              input: "$groups",
              as: "groupName",
              in: {
                $let: {
                  vars: {
                    groupMembers: {
                      $filter: {
                        input: "$divisionMembers",
                        as: "member",
                        cond: { $eq: ["$$member.group", "$$groupName"] },
                      },
                    },
                  },
                  in: {
                    group: "$$groupName",
                    memberCount: { $size: "$$groupMembers" },
                    members: "$$groupMembers",
                  },
                },
              },
            },
          },
        },
      },
    ]);
  },
};
