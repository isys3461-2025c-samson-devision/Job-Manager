import { CreateSearchProfileDTO } from "./dto/CreateSearchProfileDTO";
import { UpdateSearchProfileDTO } from "./dto/UpdateSearchProfileDTO";
import { createServiceError } from "../../../shared/utils";
import prisma from "./database";

export class SearchProfileService {

  async getByAuthId(authId: string) {
    const search_profile = await prisma.search_profile.findFirst({ where: { authId } });
    if (!search_profile) throw new Error("Search profile not found");
    return search_profile;
  }

  async createProfile(dto: CreateSearchProfileDTO) {
    const { authId } = dto;

    const exists = await prisma.search_profile.findUnique({
      where: { authId },
    });

    if (exists) throw createServiceError("Search profile already exists", 409);

    return prisma.search_profile.create({
      data: dto,
    });
  }


  async updateProfile(authId: string, data: UpdateSearchProfileDTO) {
    return await prisma.search_profile.update({
      where: {authId}, 
      data,
    });;
  }
}
