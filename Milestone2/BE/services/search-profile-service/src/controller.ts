import { Request, Response } from "express";
import { SearchProfileService } from "./service";
import { createServiceError } from "../../../shared/utils";
import { SearchProfileResponseDTO } from "./dto/SearchProfileResponseDTO";

export class SearchProfileController {
  private service = new SearchProfileService();

  create = async (req: Request, res: Response) => {
    const requester = req.user!; 

    if (requester.role !== "APPLICANT") {
      return res.status(403).json({
        success: false,
        message: "Only applicants can create a search profile",
      });
    }

    const created = await this.service.createProfile(req.body);
    return res.status(201).json(new SearchProfileResponseDTO(created));
  };


  // GET /search-profile/:authId
  get = async (req: Request, res: Response) => {
    const authId = req.params.authId;
    const requester = req.user!;

    // applicant cannot see someone else's search profile
    if (requester.role === "APPLICANT" && requester.userId !== authId) {
      throw createServiceError("Forbidden: Cannot access another user's search profile", 403);
    }

    const profile = await this.service.getByAuthId(authId);
    return res.json({
      success: true,
      data: new SearchProfileResponseDTO(profile)
    });
  };

  update = async (req: Request, res: Response) => {
    const authId = req.params.authId;
    const updated = await this.service.updateProfile(authId, req.body);
    return res.json(new SearchProfileResponseDTO(updated));
  };

}
