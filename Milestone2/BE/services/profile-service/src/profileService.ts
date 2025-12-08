import prisma from "./database";
import { createServiceError } from "../../../shared/utils";

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

  async updateProfileByAuthId(authId: string, data: any) {
    const profile = await prisma.profile.findFirst({ where: { authId } });

    if (!profile) {
      throw createServiceError("Profile not found", 404);
    }

    return prisma.profile.update({
      where: { id: profile.id }, // must use `id` here
      data,
    });
  }
}

