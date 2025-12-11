import { Router } from "express";
import { SearchProfileController } from "./controller";
import { authenticate, asyncHandler, validateRequest } from "../../../shared/middleware";
import { CreateSearchProfileSchema, UpdateSearchProfileSchema } from "./validation";

const router = Router();
const controller = new SearchProfileController();

router.post(
    "/", 
    authenticate,
    validateRequest(CreateSearchProfileSchema), 
    asyncHandler(controller.create));

router.get(
    "/:authId", 
    authenticate, 
    asyncHandler(controller.get));

router.put(
    "/:authId", 
    authenticate, 
    validateRequest(UpdateSearchProfileSchema), 
    asyncHandler(controller.update));

export default router;
