import prisma from "./database";
import { createServiceError } from "../../../shared/utils";
import { UpdateProfileDTO } from "./dto/UpdateProfileDTO";
import { BasicTextProfileResponseDTO } from "./dto/BasicTextResponseDTO";
import { UpdateBasicTextProfileDTO } from "./dto/UpdateBasicTextProfileDTO";
import { UpdateSkillsDTO } from "./dto/UpdateSkillDTO";

export class ProfileService {
  async getProfileByAuthId(authId: string) {
    const profile = await prisma.profile.findFirst({
      where: { authId },
    });

    if (!profile) {
      throw createServiceError("Profile not found", 404);
    }

    return profile;
  }

  async updateProfileByAuthId(authId: string, data: UpdateProfileDTO) {
    const profile = await prisma.profile.findFirst({ where: { authId } });

    if (!profile) {
      throw createServiceError("Profile not found", 404);
    }

    return prisma.profile.update({
      where: { id: profile.id }, 
      data,
    });
  }

  async getBasicTextProfileByAuthId(authId: string) {
    const profile = await prisma.profile.findFirst({
      where: { authId },
    }); 
        if (!profile) {
      throw createServiceError("Profile not found", 404);
    }
    return new BasicTextProfileResponseDTO(profile);
  }

  async updateBasicTextProfileByAuthId(authId: string, data: UpdateBasicTextProfileDTO) {
    const profile = await prisma.profile.findFirst({ 
      where: { authId } 
    });

    if (!profile) {
      throw createServiceError("Profile not found", 404);
    }
    
    const updateData: any = {};
    
    if (data.summary !== undefined) {
      updateData.summary = data.summary;
    }
    
    if (data.education !== undefined) {
      updateData.education = data.education;
    }
    
    if (data.workExperiences !== undefined) {
      updateData.workExperiences = data.workExperiences;
    }

    return await prisma.profile.update({
      where: { id: profile.id }, 
      data: updateData,
    });
  }

    async updateSkillsByAuthId(authId: string, data: UpdateSkillsDTO) {
    const profile = await prisma.profile.findFirst({ 
      where: { authId } 
    });

    if (!profile) {
      throw createServiceError("Profile not found", 404);
    }
    
    // Sanitize skills: trim, remove duplicates, enforce limits
    const sanitizedSkills = Array.from(new Set(
      data.skills
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0)
    )).slice(0, 30); // Enforce max limit

    return await prisma.profile.update({
      where: { id: profile.id }, 
      data: {
        skills: sanitizedSkills,
        updatedAt: new Date()
      },
    });
  }

  async getSkillsByAuthId(authId: string) {
    const profile = await prisma.profile.findFirst({
      where: { authId },
      select: { skills: true }
    });

    if (!profile) {
      throw createServiceError("Profile not found", 404);
    }

    return profile.skills || [];
  }
}

