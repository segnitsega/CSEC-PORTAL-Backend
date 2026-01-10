import bcrypt from "bcrypt";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import mongoose from "mongoose";
import { memberRepository } from "../repositories/member.repository";
import { sendOnboardingEmail } from "../utils/Mailer";
import { uploadToCloudinary } from "../config/cloudinary";
import { canManageDivision } from "../utils/checkDivisionHead";
import { buildMemberSearchOr } from "../utils/search";
import { ServiceError } from "../errors/ServiceError";

const secretKey = process.env.SECRET_KEY as string;
const refreshKey = process.env.REFRESH_KEY as string;

export interface MemberListFilters {
  search?: unknown;
  division?: unknown;
  group?: unknown;
  campusStatus?: unknown;
  attendance?: unknown;
  membershipStatus?: unknown;
  divisionRole?: unknown;
  page?: unknown;
  limit?: unknown;
}

export const memberService = {
  async listMembers(filters: MemberListFilters) {
    const {
      search,
      division,
      group,
      campusStatus,
      attendance,
      membershipStatus,
      divisionRole,
    } = filters;

    const pageNumber = Math.max(1, parseInt(filters.page as string, 10) || 1);
    const limitNumber = Math.max(1, parseInt(filters.limit as string, 10) || 10);
    const skip = (pageNumber - 1) * limitNumber;

    const query: any = {};

    const searchOr = buildMemberSearchOr(search);
    if (searchOr) query.$or = searchOr;

    if (division) query.division = division;
    if (group) query.group = group;
    if (campusStatus) query.campusStatus = campusStatus;
    if (attendance) query.attendance = attendance;
    if (membershipStatus) query.membershipStatus = membershipStatus;
    if (divisionRole) query.divisionRole = divisionRole;

    const [members, total] = await memberRepository.findPaginated(
      query,
      skip,
      limitNumber
    );

    return {
      currentPage: pageNumber,
      totalPages: Math.ceil(total / limitNumber),
      totalMembers: total,
      members,
    };
  },

  async getMemberById(id: string) {
    const member = await memberRepository.findByIdSafe(id);
    if (!member) {
      throw ServiceError.message(404, "Member not found");
    }
    return { member };
  },

  async login(body: { email?: string; password?: string }) {
    if (Object.keys(body).length === 0) {
      throw ServiceError.message(400, "Login request body is empty");
    }
    const { email, password } = body;
    if (!email || !password) {
      throw ServiceError.message(400, "Email and password are required");
    }

    const foundMember = await memberRepository.findByEmail(email);
    if (!foundMember) {
      throw ServiceError.message(404, "Member not found");
    }
    const passwordMatch = await bcrypt.compare(password, foundMember.password);
    if (!passwordMatch) {
      throw ServiceError.message(401, "Invalid password");
    }

    const token = jwt.sign(
      { id: foundMember._id, email: foundMember.email, clubRole: foundMember.clubRole },
      secretKey,
      { expiresIn: "2h" }
    );
    const refreshToken = jwt.sign(
      { id: foundMember._id, email: foundMember.email, clubRole: foundMember.clubRole },
      refreshKey,
      { expiresIn: "7d" }
    );

    await memberRepository.setRefreshToken(email, refreshToken);

    return { message: "Login Successful", token, refreshToken };
  },

  async refreshToken(refreshToken: string) {
    const foundMember = await memberRepository.findByRefreshToken(refreshToken);
    if (!foundMember) {
      throw ServiceError.message(403, "Invalid refresh token");
    }

    const decoded = await new Promise<string | JwtPayload | undefined>(
      (resolve, reject) => {
        jwt.verify(
          refreshToken,
          refreshKey,
          (error: VerifyErrors | null, payload) => {
            if (error) {
              reject(
                new ServiceError(403, {
                  message: "Token verification failed",
                  error,
                })
              );
              return;
            }
            resolve(payload);
          }
        );
      }
    );
    void decoded;

    const newAccessToken = jwt.sign(
      { id: foundMember._id, email: foundMember.email, clubRole: foundMember.clubRole },
      secretKey,
      { expiresIn: "2h" }
    );

    return { message: "Token refreshed", token: newAccessToken };
  },

  async onboardMember(
    actorClubRole: string,
    body: {
      firstName?: string;
      lastName?: string;
      division?: string;
      group?: string;
      email?: string;
      generatedPassword?: string;
    }
  ) {
    if (actorClubRole === "Member") {
      throw ServiceError.message(403, `${actorClubRole} can not add a new member`);
    }
    const { firstName, lastName, division, group, email, generatedPassword } = body;

    const emailExist = await memberRepository.findByEmailLean(email as string);
    if (emailExist) {
      throw new ServiceError(400, "Email already used");
    }

    if (await canManageDivision(actorClubRole, division as string)) {
      const hashedPassword = await bcrypt.hash(generatedPassword as string, 10);
      const newMember = memberRepository.create({
        firstName,
        lastName,
        division,
        group,
        email,
        password: hashedPassword,
      });
      await newMember.save();

      const sendResult = await sendOnboardingEmail(
        email as string,
        generatedPassword as string
      );
      return {
        message: "New member created successfuly",
        member: newMember,
        emailResult: sendResult,
      };
    }

    throw ServiceError.message(
      403,
      `${actorClubRole} can not add member in ${division}`
    );
  },

  async updateProfileDetails(
    body: Record<string, any>,
    fileBuffer?: Buffer
  ) {
    const {
      firstName,
      lastName,
      phoneNumber,
      email,
      birthDate,
      github,
      gender,
      telegramHandle,
      graduationYear,
      specialization,
      department,
      mentor,
      universityId,
      instagramHandle,
      linkedinHandle,
      codeforcesHandle,
      cv,
      leetcodeHandle,
      bio,
    } = body;

    let profilePictureUrl: string | undefined;

    if (fileBuffer) {
      const publicId = `member_${Date.now()}_${Math.round(Math.random() * 1e6)}`;
      const result = await uploadToCloudinary(fileBuffer, publicId);
      profilePictureUrl = result.secure_url;
    }

    const foundMember = await memberRepository.findByEmail(email);
    if (!foundMember) {
      throw ServiceError.message(404, "Member not found");
    }

    const updateData: { [key: string]: any } = {
      firstName,
      lastName,
      phoneNumber,
      birthDate,
      github,
      gender,
      telegramHandle,
      graduationYear,
      specialization,
      department,
      universityId,
      instagramHandle,
      linkedinHandle,
      codeforcesHandle,
      leetcodeHandle,
      cv,
      bio,
      mentor,
    };

    if (profilePictureUrl) {
      updateData.profilePicture = profilePictureUrl;
    }

    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined || updateData[key] === null) {
        delete updateData[key];
      }
    });

    await memberRepository.updateByEmail(email, updateData);

    return { message: "Profile updated successfully" };
  },

  async getAllHeads(actorClubRole: string) {
    const allowedRoles = ["President", "Vice President"];
    if (!allowedRoles.includes(actorClubRole)) {
      throw ServiceError.message(
        403,
        `${actorClubRole} is not allowed to get division presidents.`
      );
    }
    const heads = await memberRepository.findHeads();
    if (!heads || heads.length === 0) {
      throw ServiceError.message(400, "No heads found");
    }
    return { length: heads.length, heads };
  },

  async banMember(actorClubRole: string, id: string) {
    if (actorClubRole === "Member") {
      throw ServiceError.message(403, `${actorClubRole} can not ban a member`);
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw ServiceError.message(404, `Invalid member ID: ${id}`);
    }
    const foundMember = await memberRepository.findById(id);
    if (!foundMember) {
      throw ServiceError.message(400, `No member found with ID: ${id}.`);
    }
    const division = foundMember.division;
    if (await canManageDivision(actorClubRole, division)) {
      foundMember.banned = true;
      foundMember.membershipStatus = "Banned";
      await foundMember.save();
      return { message: `Member with ${id} id banned successfully.` };
    }
    throw ServiceError.message(
      403,
      `${actorClubRole} is not allowed to ban members in ${division}`
    );
  },
};
