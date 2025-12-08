import { Request, Response } from "express";
import { ProfileService } from "./profileService";
import { createServiceError } from "../../../shared/utils";

export class ProfileController {
  private profileService = new ProfileService();

  getProfile = async (req: Request, res: Response) => {
    const { authId } = req.params;
    const requester = req.user!;

    if (requester.role === "APPLICANT" && requester.userId !== authId) {
      throw createServiceError("Forbidden: Cannot access another user's profile", 403);
    }

    const profile = await this.profileService.getProfileByAuthId(authId);
    return res.json({ success: true, data: profile });
  };

  updateProfile = async (req: Request, res: Response) => {
    const { authId } = req.params;
    const requester = req.user!;

    if (requester.role === "APPLICANT" && requester.userId !== authId) {
      throw createServiceError("Forbidden: Cannot update another user's profile", 403);
    }

    const profile = await this.profileService.updateProfileByAuthId(authId, req.body);
    return res.json({ success: true, data: profile });
  };
}
