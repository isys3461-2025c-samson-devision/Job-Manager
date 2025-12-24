import { Request, Response } from 'express';
import multer from 'multer';
import { MediaService } from './mediaService/mediaService';
import { createServiceError } from '../../../shared/utils';
import { MediaResponseDTO } from './dto/internalDTOs/mediaResponseDTO';

export class MediaController {
  private mediaService: MediaService;
  
  // Multer configuration for memory storage
  private upload: multer.Multer;
  
  constructor() {
    this.mediaService = new MediaService();
    this.upload = multer({
      storage: multer.memoryStorage(),
      limits: {
        fileSize: 100 * 1024 * 1024, // 100MB max file size
      },
      fileFilter: (req, file, cb) => {
        // Allow images and videos
        if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
          cb(null, true);
        } else {
          cb(new Error('Only image and video files are allowed'));
        }
      }
    });
  }

  /**
   * Middleware for file upload
   */
  getUploadMiddleware() {
    return this.upload.single('file');
  }

  /**
   * Upload avatar (POST /avatars) - Requirement 3.2.1
   */
  async uploadAvatar(req: Request, res: Response): Promise<void> {
    try {
      const authId = req.params.authId;
      const file = req.file;
      const { title, description, tags } = req.body;
      const requester = req.user!;

      if (requester.role === "APPLICANT" && requester.userId !== authId) {
        throw createServiceError("Forbidden: Cannot update another user's profile", 403);
      }

      if (!file) {
        res.status(400).json({
          success: false,
          error: 'No file provided'
        });
        return;
      }

      if (!authId) {
        res.status(400).json({
          success: false,
          error: 'authId is required'
        });
        return;
      }

      // Parse tags if provided as string
      let parsedTags: string[] = [];
      if (tags) {
        parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;
      }

      const result = await this.mediaService.uploadAvatar(
        authId,
        file.buffer,
        file.originalname,
        file.mimetype,
        title,
        description,
        parsedTags
      );

      res.status(201).json({
        success: true,
        data: result
      });
    } catch (error: any) {
      console.error('Upload avatar error:', error);
      
      const status = error.status || 500;
      const message = error.message || 'Failed to upload avatar';
      
      res.status(status).json({
        success: false,
        error: message
      });
    }
  }

  /**
   * Get avatar (GET /avatars/:authId) - Requirement 3.2.2
   */
  async getAvatar(req: Request, res: Response): Promise<void> {
    try {
      const { authId } = req.params;
      const requester = req.user!;

      if (requester.role === "APPLICANT" && requester.userId !== authId) {
        throw createServiceError("Forbidden: Cannot update another user's profile", 403);
      }
      if (!authId) {
        res.status(400).json({
          success: false,
          error: 'authId is required'
        });
        return;
      }

      const avatar = await this.mediaService.getAvatarByAuthId(authId);
      console.log('AVATAR IN CONTROLLER:', avatar);

      if (!avatar) {
        res.status(404).json({
          success: false,
          error: 'Avatar not found'
        });
        return;
      }

      const signedUrl = await this.mediaService.createSignedUrl(avatar.s3Key);
      
      const dto = new MediaResponseDTO({
        ...avatar,
        s3Url: signedUrl,
      });

      res.status(200).json({
        success: true,
        data: dto
      });
    } catch (error: any) {
      console.error('Get avatar error:', error);
      
      const status = error.status || 500;
      const message = error.message || 'Failed to get avatar';
      
      res.status(status).json({
        success: false,
        error: message
      });
    }
  }

  /**
   * Upload portfolio image (POST /portfolio/images) - Requirement 3.2.3
   */
  async uploadPortfolioImage(req: Request, res: Response): Promise<void> {
    try {
      const authId = req.params.authId;
      const file = req.file;
      const { title, description, tags } = req.body;
      const requester = req.user!;

      if (requester.role === "APPLICANT" && requester.userId !== authId) {
        throw createServiceError("Forbidden: Cannot update another user's profile", 403);
      }

      if (!file) {
        res.status(400).json({
          success: false,
          error: 'No file provided'
        });
        return;
      }

      if (!authId) {
        res.status(400).json({
          success: false,
          error: 'authId is required'
        });
        return;
      }

      // Parse tags if provided as string
      let parsedTags: string[] = [];
      if (tags) {
        parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;
      }

      const result = await this.mediaService.uploadPortfolioImage(
        authId,
        file.buffer,
        file.originalname,
        file.mimetype,
        title,
        description,
        parsedTags
      );

      res.status(201).json({
        success: true,
        data: result
      });
    } catch (error: any) {
      console.error('Upload portfolio image error:', error);
      
      const status = error.status || 500;
      const message = error.message || 'Failed to upload portfolio image';
      
      res.status(status).json({
        success: false,
        error: message
      });
    }
  }

  /**
   * Upload portfolio video (POST /portfolio/videos) - Requirement 3.2.3
   */
  async uploadPortfolioVideo(req: Request, res: Response): Promise<void> {
    try {
      const authId = req.params.authId;
      const file = req.file;
      const { title, description, tags } = req.body;
      const requester = req.user!;

      if (requester.role === "APPLICANT" && requester.userId !== authId) {
        throw createServiceError("Forbidden: Cannot update another user's profile", 403);
      }

      if (!file) {
        res.status(400).json({
          success: false,
          error: 'No file provided'
        });
        return;
      }

      if (!authId) {
        res.status(400).json({
          success: false,
          error: 'authId is required'
        });
        return;
      }

      // Parse tags if provided as string
      let parsedTags: string[] = [];
      if (tags) {
        parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;
      }

      const result = await this.mediaService.uploadPortfolioVideo(
        authId,
        file.buffer,
        file.originalname,
        file.mimetype,
        title,
        description,
        parsedTags
      );

      res.status(201).json({
        success: true,
        data: result
      });
    } catch (error: any) {
      console.error('Upload portfolio video error:', error);
      
      const status = error.status || 500;
      const message = error.message || 'Failed to upload portfolio video';
      
      res.status(status).json({
        success: false,
        error: message
      });
    }
  }

  /**
   * Get portfolio items (GET /portfolio/:authId) - Requirement 3.2.4
   */
  async getPortfolio(req: Request, res: Response): Promise<void> {
    try {
      const { authId } = req.params;
      const requester = req.user!;

      if (requester.role === "APPLICANT" && requester.userId !== authId) {
        throw createServiceError("Forbidden: Cannot update another user's profile", 403);
      }
      const { 
        page = '1', 
        limit = '20', 
        mediaType 
      } = req.query;

      if (!authId) {
        res.status(400).json({
          success: false,
          error: 'authId is required'
        });
        return;
      }

      const portfolio = await this.mediaService.getPortfolioByAuthId(
        authId,
        parseInt(page as string),
        parseInt(limit as string),
        mediaType as any
      );

      res.status(200).json({
        success: true,
        data: portfolio
      });
    } catch (error: any) {
      console.error('Get portfolio error:', error);
      
      const status = error.status || 500;
      const message = error.message || 'Failed to get portfolio';
      
      res.status(status).json({
        success: false,
        error: message
      });
    }
  }

  /**
   * Get media by ID (GET /media/:mediaId)
   */
  async getMediaById(req: Request, res: Response): Promise<void> {
    try {
      const { mediaId } = req.params;

      if (!mediaId) {
        res.status(400).json({
          success: false,
          error: 'mediaId is required'
        });
        return;
      }

      const media = await this.mediaService.getMediaById(mediaId);

      res.status(200).json({
        success: true,
        data: media
      });
    } catch (error: any) {
      console.error('Get media by ID error:', error);
      
      const status = error.status || 500;
      const message = error.message || 'Failed to get media';
      
      res.status(status).json({
        success: false,
        error: message
      });
    }
  }

  /**
   * Get all media by auth ID (GET /media/all/:authId)
   */
  async getAllMediaByAuthId(req: Request, res: Response): Promise<void> {
    try {
      const { authId } = req.params;

      if (!authId) {
        res.status(400).json({
          success: false,
          error: 'authId is required'
        });
        return;
      }

      const media = await this.mediaService.getAllMediaByAuthId(authId);

      res.status(200).json({
        success: true,
        data: media
      });
    } catch (error: any) {
      console.error('Get all media error:', error);
      
      const status = error.status || 500;
      const message = error.message || 'Failed to get all media';
      
      res.status(status).json({
        success: false,
        error: message
      });
    }
  }

  /**
   * Search media by tags (GET /media/search)
   */
  async searchMediaByTags(req: Request, res: Response): Promise<void> {
    try {
      const { 
        tags, 
        authId,
        page = '1', 
        limit = '20' 
      } = req.query;

      if (!tags) {
        res.status(400).json({
          success: false,
          error: 'tags query parameter is required'
        });
        return;
      }

      // Parse tags - can be comma-separated string or array
      let parsedTags: string[] = [];
      if (typeof tags === 'string') {
        parsedTags = tags.split(',');
      } else if (Array.isArray(tags)) {
        parsedTags = tags as string[];
      }

      const result = await this.mediaService.searchMediaByTags(
        parsedTags,
        authId as string,
        parseInt(page as string),
        parseInt(limit as string)
      );

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error: any) {
      console.error('Search media by tags error:', error);
      
      const status = error.status || 500;
      const message = error.message || 'Failed to search media';
      
      res.status(status).json({
        success: false,
        error: message
      });
    }
  }

  /**
   * Get recent media (GET /media/recent)
   */
  async getRecentMedia(req: Request, res: Response): Promise<void> {
    try {
      const { 
        excludeAuthId,
        page = '1', 
        limit = '20' 
      } = req.query;

      const result = await this.mediaService.getRecentMedia(
        excludeAuthId as string,
        parseInt(page as string),
        parseInt(limit as string)
      );

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error: any) {
      console.error('Get recent media error:', error);
      
      const status = error.status || 500;
      const message = error.message || 'Failed to get recent media';
      
      res.status(status).json({
        success: false,
        error: message
      });
    }
  }

  /**
   * Get media statistics (GET /media/stats/:authId)
   */
  async getMediaStats(req: Request, res: Response): Promise<void> {
    try {
      const { authId } = req.params;

      if (!authId) {
        res.status(400).json({
          success: false,
          error: 'authId is required'
        });
        return;
      }

      const stats = await this.mediaService.getMediaStats(authId);

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error: any) {
      console.error('Get media stats error:', error);
      
      const status = error.status || 500;
      const message = error.message || 'Failed to get media statistics';
      
      res.status(status).json({
        success: false,
        error: message
      });
    }
  }

  /**
   * Delete media (Soft delete - PATCH /media/:mediaId/delete)
   */
  async deleteMedia(req: Request, res: Response): Promise<void> {
    try {
      const { mediaId } = req.params;

      if (!mediaId) {
        res.status(400).json({
          success: false,
          error: 'mediaId is required'
        });
        return;
      }

      // Note: You'll need to implement a delete method in MediaService
      // For now, this is a placeholder
      res.status(501).json({
        success: false,
        error: 'Delete functionality not implemented yet'
      });
    } catch (error: any) {
      console.error('Delete media error:', error);
      
      const status = error.status || 500;
      const message = error.message || 'Failed to delete media';
      
      res.status(status).json({
        success: false,
        error: message
      });
    }
  }

  /**
   * Health check endpoint
   */
  async healthCheck(req: Request, res: Response): Promise<void> {
    res.status(200).json({
      success: true,
      message: 'Media service is running',
      timestamp: new Date().toISOString()
    });
  }
}