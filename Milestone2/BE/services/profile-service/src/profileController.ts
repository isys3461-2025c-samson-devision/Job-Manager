import { Request, Response, NextFunction } from "express";
import { ProfileService } from "./profileService";
import { createServiceError } from "../../../shared/utils";

const profileService = new ProfileService();

export class ProfileController {
  async createProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.userId; // extracted by auth middleware
      const profile = await profileService.createProfile(userId, req.body);
      return res.status(201).json(profile);
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.userId;
      const profile = await profileService.getProfile(userId);

      if (!profile) {
        throw createServiceError("Profile not found", 404);
      }

      return res.json(profile);
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.userId;
      const updated = await profileService.updateProfile(userId, req.body);
      return res.json(updated);
    } catch (error) {
      next(error);
    }
  }

  async deleteProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.userId;
      await profileService.deleteProfile(userId);
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
