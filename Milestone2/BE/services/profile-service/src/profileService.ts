import prisma from "./database";
import { createServiceError } from "../../../shared/utils";
import { UpdateProfileDTO } from "./dto/UpdateProfileDTO";
import { BasicTextProfileResponseDTO } from "./dto/BasicTextResponseDTO";
import { UpdateBasicTextProfileDTO } from "./dto/UpdateBasicTextProfileDTO";

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
      if (!data.country) {
        throw createServiceError("Country is required", 400);
      }
      if (!Array.isArray(data.skills) || data.skills.length === 0) {
        throw createServiceError("At least one skill is required", 400);
      }

      return prisma.profile.create({
        data: {
          authId,
          country: data.country,
          skills: data.skills,
          phone: data.phone,
          address: data.address,
          city: data.city,
          name: data.name,
          birthday: data.birthday,
          isPremium: data.isPremium,
          mediaId: data.mediaId,
          summary: data.summary,
          education: data.education ?? [],
          workExperiences: data.workExperiences ?? [],
          updatedAt: new Date(),
        },
      });
    }

    return prisma.profile.update({
      where: { id: profile.id }, 
      data: {
        ...data,
        updatedAt: new Date(),
      },
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
}

