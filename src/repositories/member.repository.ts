import Member from "../models/membersModel";
import type { memberInterface } from "../models/membersModel";
import { FilterQuery } from "mongoose";

export const memberRepository = {
  findPaginated(query: FilterQuery<memberInterface>, skip: number, limit: number) {
    return Promise.all([
      Member.find(query)
        .select("-password -refreshToken")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),
      Member.countDocuments(query),
    ]);
  },

  findByIdSafe(id: string) {
    return Member.findById(id).select("-password -refreshToken").lean();
  },

  findById(id: string) {
    return Member.findById(id);
  },

  findByEmail(email: string) {
    return Member.findOne({ email });
  },

  findByEmailLean(email: string) {
    return Member.findOne({ email }).lean();
  },

  findByRefreshToken(refreshToken: string) {
    return Member.findOne({ refreshToken });
  },

  setRefreshToken(email: string, refreshToken: string) {
    return Member.updateOne({ email }, { $set: { refreshToken } });
  },

  updateByEmail(email: string, update: Record<string, unknown>) {
    return Member.updateOne({ email }, { $set: { ...update } });
  },

  findHeads() {
    return Member.find({ clubRole: { $ne: "Member" } }).select(
      "firstName middleName lastName clubRole email membershipStatus"
    );
  },

  create(data: Partial<memberInterface>) {
    return new Member(data);
  },

  banByEmails(emails: string[]) {
    return Member.updateMany(
      { email: { $in: emails } },
      { $set: { banned: true, membershipStatus: "Banned" } }
    );
  },

  demoteDivisionPresident(division: string) {
    return Member.findOneAndUpdate(
      { clubRole: `${division} President` },
      { $set: { clubRole: "Member" } }
    );
  },

  promoteToDivisionPresident(division: string, email: string) {
    return Member.findOneAndUpdate(
      { email },
      { $set: { clubRole: `${division} President` } }
    );
  },

  findMembersForAttendance(division: string, groups: string[]) {
    return Member.find({
      division,
      group: { $in: groups },
      membershipStatus: "Active",
    }).select("_id firstName lastName division group");
  },

  findByDivision(division: string) {
    return Member.find({ division }).select("firstName lastName");
  },
};
