import { Request, Response } from "express";
import { memberService } from "../services/member.service";
import { handleServiceError } from "../errors/ServiceError";

export const getMembers = async (req: Request | any, res: Response): Promise<void> => {
  try {
    const result = await memberService.listMembers(req.query);
    res.status(200).json(result);
  } catch (error) {
    if (handleServiceError(res, error)) return;
    console.error("Error fetching members:", error);
    res.status(500).json({ message: "Error fetching members", error });
  }
};

export const getMemberById = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;
  try {
    const result = await memberService.getMemberById(id);
    res.status(200).json(result);
  } catch (error) {
    if (handleServiceError(res, error)) return;
    res.status(501).json({ message: "Error retrieving Member", error: error });
  }
};

export const handleLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await memberService.login(req.body);
    res.status(200).json(result);
  } catch (error) {
    if (handleServiceError(res, error)) return;
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const handleRefreshToken = async (req: Request, res: Response): Promise<void> => {
  const refreshToken = req.headers["authorization"]?.split(" ")[1];
  if (!refreshToken) {
    res.status(401).json({ message: "No refresh token provided" });
    return;
  }
  try {
    const result = await memberService.refreshToken(refreshToken);
    res.status(200).json(result);
  } catch (error) {
    if (handleServiceError(res, error)) return;
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const handleMemberOnboarding = async (req: Request | any, res: Response): Promise<void> => {
  try {
    const result = await memberService.onboardMember(req.user.clubRole, req.body);
    res.status(200).json(result);
  } catch (error) {
    if (handleServiceError(res, error)) return;
    res.status(500).json({ message: "Error adding a member", error });
  }
};

export const handleProfileDetails = async (req: Request | any, res: Response): Promise<void> => {
  try {
    const result = await memberService.updateProfileDetails(req.body, req.file?.buffer);
    res.status(200).json(result);
  } catch (error) {
    if (handleServiceError(res, error)) return;
    console.error(error);
    res.status(500).json({ message: "Failed to update member profile", error });
  }
};

export const getAllHeads = async (req: Request | any, res: Response): Promise<void> => {
  try {
    const result = await memberService.getAllHeads(req.user.clubRole);
    res.status(200).json(result);
  } catch (error) {
    if (handleServiceError(res, error)) return;
    res.status(500).json({ message: "Cannot get heads", error });
  }
};

export const deleteMember = async (req: Request | any, res: Response): Promise<void> => {
  try {
    const result = await memberService.banMember(req.user.clubRole, req.params.id);
    res.status(200).json(result);
  } catch (error) {
    if (handleServiceError(res, error)) return;
    console.error("Error banning member:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
