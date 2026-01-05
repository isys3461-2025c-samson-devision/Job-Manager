import { Request, Response } from "express";
import { ProfileService } from "./profileService";
import { createServiceError } from "../../../shared/utils";
import { ProfileResponseDTO } from "./dto/ProfileResponseDTO";
import { BasicTextProfileResponseDTO } from "./dto/BasicTextResponseDTO";
import { UpdateSkillsDTO } from "./dto/UpdateSkillDTO";
import { CreateProfileDTO } from "./dto/CreateProfileDTO";

export class ProfileController {
  private profileService = new ProfileService();

  createProfile = async (req: Request, res: Response) => {
    const { authId } = req.params;
    const requester = req.user!;
    
    if (requester.role === "APPLICANT" && requester.userId !== authId) {
      throw createServiceError("Forbidden: Cannot update another user's profile", 403);
    }
    const profile = await this.profileService.createProfileByAuthId(authId, req.body);
    return res.json({ success: true, data: new ProfileResponseDTO(profile) });
  }

  getProfile = async (req: Request, res: Response) => {
    const { authId } = req.params;
    const requester = req.user!;

    if (requester.role === "APPLICANT" && requester.userId !== authId) {
      throw createServiceError("Forbidden: Cannot access another user's profile", 403);
    }

    const profile = await this.profileService.getProfileByAuthId(authId);
    return res.json({ success: true, data: new ProfileResponseDTO(profile) });
  };

  getAllProfile = async (req: Request, res: Response) => {
    const profiles = await this.profileService.getAllProfile();
    const profileDTOs = profiles.map(profile => new ProfileResponseDTO(profile));
    return res.json({ success: true, data: profileDTOs });
  }

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

  updateSkills = async (req: Request, res: Response) => {
    const { authId } = req.params;
    const requester = req.user!;

    if (requester.role === "APPLICANT" && requester.userId !== authId) {
      throw createServiceError("Forbidden: Cannot update another user's skills", 403);
    }

    const updateSkillsDTO = new UpdateSkillsDTO(req.body);
    const updatedProfile = await this.profileService.updateSkillsByAuthId(authId, updateSkillsDTO);
    
    return res.json({ 
      success: true, 
      data: {
        skills: updatedProfile.skills,
        count: updatedProfile.skills?.length || 0
      },
      message: 'Skills updated successfully'
    });
  };

  // Get skills
  getSkills = async (req: Request, res: Response) => {
    const { authId } = req.params;
    const requester = req.user!;

    if (requester.role === "APPLICANT" && requester.userId !== authId) {
      throw createServiceError("Forbidden: Cannot access another user's skills", 403);
    }

    const skills = await this.profileService.getSkillsByAuthId(authId);
    
    return res.json({ 
      success: true, 
      data: {
        skills,
        count: skills.length
      }
    });
  };
}
