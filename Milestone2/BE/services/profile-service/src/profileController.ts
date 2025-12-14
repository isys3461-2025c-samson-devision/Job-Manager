import { Request, Response } from "express";
import { ProfileService } from "./profileService";
import { createServiceError } from "../../../shared/utils";
import { ProfileResponseDTO } from "./dto/ProfileResponseDTO";
import { BasicTextProfileResponseDTO } from "./dto/BasicTextResponseDTO";

export class ProfileController {
  private profileService = new ProfileService();

  getProfile = async (req: Request, res: Response) => {
    const { authId } = req.params;
    const requester = req.user!;

    if (requester.role === "APPLICANT" && requester.userId !== authId) {
      throw createServiceError("Forbidden: Cannot access another user's profile", 403);
    }

    const profile = await this.profileService.getProfileByAuthId(authId);
    return res.json({ success: true, data: new ProfileResponseDTO(profile) });
  };

  updateProfile = async (req: Request, res: Response) => {
    const { authId } = req.params;
    const requester = req.user!;

    if (requester.role === "APPLICANT" && requester.userId !== authId) {
      throw createServiceError("Forbidden: Cannot update another user's profile", 403);
    }

    const profile = await this.profileService.updateProfileByAuthId(authId, req.body);
    return res.json({ success: true, data: new ProfileResponseDTO(profile) });
  };

  getBasicTextProfile = async (req: Request, res: Response) => {
    const { authId } = req.params;
    const requester = req.user!;
    
    if (requester.role === "APPLICANT" && requester.userId !== authId) {
      throw createServiceError("Forbidden: Cannot access another user's basic text profile", 403);
    }

    const basicTextProfile = await this.profileService.getBasicTextProfileByAuthId(authId);
    return res.json({ success: true, data: new ProfileResponseDTO(basicTextProfile) });
  }

  updateBasicTextProfile = async (req: Request, res: Response) => {
    const { authId } = req.params;
    const requester = req.user!;
    if (requester.role === "APPLICANT" && requester.userId !== authId) {
      throw createServiceError("Forbidden: Cannot update another user's basic text profile", 403);
    }
    const basicTextProfile = await this.profileService.updateBasicTextProfileByAuthId(authId, req.body);
    return res.json({ success: true, data: new BasicTextProfileResponseDTO(basicTextProfile) });
  }
}
