import { Router } from "express";
import { ProfileController } from "./profileController";
import { authenticate, asyncHandler, validateRequest } from "../../../shared/middleware";
import { updateProfileSchema, updateBasicTextProfileSchema, updateSkillsSchema } from "./validation";


const router = Router();
const controller = new ProfileController();

router.get(
  "/:authId",
  authenticate,
  asyncHandler(controller.getProfile)
);

router.put(
  "/:authId",
  authenticate,
  validateRequest(updateProfileSchema),
  asyncHandler(controller.updateProfile)
);

router.get(
  "/:authId/basic-text-profile",
  authenticate,
  asyncHandler(controller.getBasicTextProfile)
);

router.put(
  "/:authId/basic-text-profile",
  authenticate,
  validateRequest(updateBasicTextProfileSchema),
  asyncHandler(controller.updateBasicTextProfile)
);

router.get(
  "/:authId/skills",
  authenticate,
  asyncHandler(controller.getSkills)
);

// Update/replace all skills
router.put(
  "/:authId/skills",
  authenticate,
  validateRequest(updateSkillsSchema),
  asyncHandler(controller.updateSkills)
);


export default router;
