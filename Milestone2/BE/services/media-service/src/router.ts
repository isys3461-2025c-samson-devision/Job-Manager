// src/router.ts
import express from 'express';
import { MediaController } from './mediaController';
import { authenticate, asyncHandler, validateRequest } from "../../../shared/middleware";

const router = express.Router();
const mediaController = new MediaController();

// Health check
router.get('/health', mediaController.healthCheck.bind(mediaController));

// Avatar routes
router.post(
  '/avatars/:authId',
  mediaController.getUploadMiddleware(),
  authenticate,
  mediaController.uploadAvatar.bind(mediaController)
);
router.get(
  '/avatars/:authId',
  authenticate,
  mediaController.getAvatar.bind(mediaController)
);

// Portfolio routes
router.post(
  '/portfolio/images/:authId',
  authenticate,
  mediaController.getUploadMiddleware(),
  mediaController.uploadPortfolioImage.bind(mediaController)
);
router.post(
  '/portfolio/videos/:authId',
  authenticate,
  mediaController.getUploadMiddleware(),
  mediaController.uploadPortfolioVideo.bind(mediaController)
);
router.get(
  '/portfolio/:authId',
  authenticate,
  mediaController.getPortfolio.bind(mediaController)
);

// Media routes
router.get(
  '/media/all/:authId',
  mediaController.getAllMediaByAuthId.bind(mediaController)
);
router.get(
  '/media/search',
  mediaController.searchMediaByTags.bind(mediaController)
);
router.get(
  '/media/recent',
  mediaController.getRecentMedia.bind(mediaController)
);
router.get(
  '/media/stats/:authId',
  mediaController.getMediaStats.bind(mediaController)
);

// Delete route (soft delete)
router.patch(
  '/media/:mediaId/delete',
  mediaController.deleteMedia.bind(mediaController)
);

router.get(
  '/media/:mediaId',
  mediaController.getMediaById.bind(mediaController)
);
export default router;