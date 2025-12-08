import { Router } from "express";
import { ProfileController } from "./profileController";
import { authenticate, asyncHandler, validateRequest } from "../../../shared/middleware";
import { updateProfileSchema } from "./validation";

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

export default router;
