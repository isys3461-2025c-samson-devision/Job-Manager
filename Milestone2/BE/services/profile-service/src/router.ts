import { Router } from "express";
import { ProfileController } from "./profileController";
import { validate } from "../middlewares/validate";
import {
  createProfileSchema,
  updateProfileSchema,
} from "./validation";
import { authenticate } from ".../middleware/index";

const router = Router();
const controller = new ProfileController();

router.post(
  "/",
  authenticate,
  validate(createProfileSchema),
  controller.createProfile.bind(controller)
);

router.get(
  "/",
  authenticate,
  controller.getProfile.bind(controller)
);

router.put(
  "/",
  authenticate,
  validate(updateProfileSchema),
  controller.updateProfile.bind(controller)
);

router.delete(
  "/",
  authenticate,
  controller.deleteProfile.bind(controller)
);

export default router;
