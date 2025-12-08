import prisma from "./database";
import { createServiceError } from "../../../shared/utils";

export class ProfileService {
  async createProfile(userId: string, data: any) {
    const existing = await prisma.profile.findUnique({ where: { userId } });
    if (existing) throw createServiceError("Profile already exists", 400);

    return prisma.profile.create({
      data: {
        userId,
        ...data,
      },
    });
  }

  async getProfile(userId: string) {
    return prisma.profile.findUnique({ where: { userId } });
  }

  async updateProfile(userId: string, data: any) {
    return prisma.profile.update({
      where: { userId },
      data,
    });
  }

  async deleteProfile(userId: string) {
    return prisma.profile.delete({ where: { userId } });
  }
}
