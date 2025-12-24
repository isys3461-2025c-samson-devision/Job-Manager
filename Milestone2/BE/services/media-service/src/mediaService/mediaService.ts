import prisma from '../database';
import { createServiceError } from '../../../../shared/utils';
import { S3StorageService } from './S3StorageService';
import { ImageProcessor } from './imageProcessor';
import { VideoProcessor } from './videoProcessor';
import { MediaType } from '../dto/internalDTOs/mediaResponseDTO';
import { MediaResponseDTO } from '../dto/internalDTOs/mediaResponseDTO';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export class MediaService {
  
  private s3Service: S3StorageService;
  private imageProcessor: ImageProcessor;
  private videoProcessor: VideoProcessor;
  private readonly s3Client: S3Client;
  
  constructor() {
    
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION!,
      credentials: {
        accessKeyId: process.env.ACCESS_KEY!,
        secretAccessKey: process.env.SECRET_KEY!,
      },
    });
    this.s3Service = new S3StorageService();
    this.imageProcessor = new ImageProcessor();
    this.videoProcessor = new VideoProcessor();
    console.log('MEDIA SERVICE FILE:', __filename);
  }
  
  
  
  /**
   * Upload avatar (Requirement 3.2.1)
   */
  async uploadAvatar(
    authId: string,
    fileBuffer: Buffer,
    originalName: string,
    mimeType: string,
    title?: string,
    description?: string,
    tags?: string[]
  ): Promise<MediaResponseDTO> {
    try {
      console.log('=== AVATAR UPLOAD/REPLACE START ===');
      console.log('Auth ID:', authId);
      
      // 1. Validate file type
      if (!mimeType.startsWith('image/')) {
        throw createServiceError('Only image files allowed for avatar', 400);
      }

      // 2. Check for existing avatar and mark as deleted
      const existingAvatar = await prisma.media.findFirst({
        where: {
          authId,
          mediaType: MediaType.AVATAR
        }
      });
      if (existingAvatar) { 
        await prisma.media.delete({
          where: { id: existingAvatar.id }
        });
        console.log('✅ Previous avatar marked as deleted');
      }
      
      // 3. Process image (auto-resize to standard size)
      console.log('Processing new avatar image...');
      const { processedBuffer, width, height } = await this.imageProcessor.processAvatar(fileBuffer);
      
      // 4. Generate S3 key
      const s3Key = this.s3Service.generateKey(authId, 'avatar', originalName);
      console.log('Generated S3 key:', s3Key);
      
      // 5. Upload to S3
      console.log('Uploading to S3...');
      const { key, url } = await this.s3Service.uploadFile(
        processedBuffer,
        s3Key,
        'image/webp',
        {
          authId,
          mediaType: 'AVATAR',
          originalName,
          width: width.toString(),
          height: height.toString()
        }
      );
      
      console.log('✅ S3 upload successful');
      
      // 6. Save to database
      console.log('Saving to database...');
      const media = await prisma.media.create({
        data: {
          authId,
          mediaType: MediaType.AVATAR,
          s3Key: key,
          s3Url: url,
          fileSize: processedBuffer.length,
          mimeType: 'image/webp',
          width,
          height,
          title,
          description,
          tags: tags || [],
          uploadedAt: new Date(),
          processedAt: new Date()
        }
      });

      return new MediaResponseDTO(media);

    } catch (error: any) {
      console.error('Avatar upload/replace failed:', error);
      throw createServiceError(
        error.message || 'Failed to upload/replace avatar',
        error.status || 500
      );
    }
  }
  
  /**
   * Upload portfolio image (Requirement 3.2.3)
   */
  async uploadPortfolioImage(
    authId: string,
    fileBuffer: Buffer,
    originalName: string,
    mimeType: string,
    title?: string,
    description?: string,
    tags?: string[]
  ): Promise<MediaResponseDTO> {
    try {
      // 1. Validate
      if (!mimeType.startsWith('image/')) {
        throw createServiceError('Only image files allowed', 400);
      }
      
      // 2. Process image and generate thumbnail
      const { processedBuffer, width, height, thumbnailBuffer } = 
        await this.imageProcessor.processPortfolioImage(fileBuffer);
      
      // 3. Generate S3 keys
      const mainKey = this.s3Service.generateKey(authId, 'portfolio', originalName);
      const thumbnailKey = this.s3Service.generateKey(authId, 'portfolio', originalName, true);
      
      // 4. Upload main image to S3
      const { key, url } = await this.s3Service.uploadFile(
        processedBuffer,
        mainKey,
        'image/webp',
        {
          authId,
          mediaType: 'PORTFOLIO_IMAGE',
          originalName,
          width: width.toString(),
          height: height.toString()
        }
      );
      
      // 5. Upload thumbnail to S3
      const { url: thumbnailUrl } = await this.s3Service.uploadFile(
        thumbnailBuffer,
        thumbnailKey,
        'image/webp',
        {
          authId,
          mediaType: 'PORTFOLIO_IMAGE_THUMB',
          originalName: `thumb_${originalName}`,
          width: '300',
          height: '300'
        }
      );
      
      // 6. Save to database
      const media = await prisma.media.create({
        data: {
          authId, // Changed from profileId to authId
          mediaType: MediaType.PORTFOLIO_IMAGE,
          s3Key: key,
          s3Url: url,
          thumbnailKey,
          thumbnailUrl,
          fileSize: processedBuffer.length,
          mimeType: 'image/webp',
          width,
          height,
          title,
          description,
          tags: tags || [],
          uploadedAt: new Date(),
          processedAt: new Date()
        }
      });
      
      console.log(`✅ Portfolio image uploaded to S3: ${key}`);
      return new MediaResponseDTO(media);
      
    } catch (error: any) {
      console.error('Portfolio image upload failed:', error);
      throw createServiceError(
        error.message || 'Failed to upload portfolio image',
        error.status || 500
      );
    }
  }
  
  /**
   * Upload portfolio video (Requirement 3.2.3)
   */
  async uploadPortfolioVideo(
    authId: string,
    fileBuffer: Buffer,
    originalName: string,
    mimeType: string,
    title?: string,
    description?: string,
    tags?: string[]
  ): Promise<MediaResponseDTO> {
    try {
      // 1. Validate
      if (!mimeType.startsWith('video/')) {
        throw createServiceError('Only video files allowed', 400);
      }
      
      // 2. Generate S3 key
      const key = this.s3Service.generateKey(authId, 'portfolio', originalName);
      
      // 3. Upload to S3
      const { url } = await this.s3Service.uploadFile(
        fileBuffer,
        key,
        mimeType,
        {
          authId,
          mediaType: 'PORTFOLIO_VIDEO',
          originalName
        }
      );
      
      // 4. Save to database
      const media = await prisma.media.create({
        data: {
          authId, // Changed from profileId to authId
          mediaType: MediaType.PORTFOLIO_VIDEO,
          s3Key: key,
          s3Url: url,
          fileSize: fileBuffer.length,
          mimeType,
          title,
          description,
          tags: tags || [],
          uploadedAt: new Date(),
          processedAt: new Date()
        }
      });
      
      console.log(`✅ Portfolio video uploaded to S3: ${key}`);
      return new MediaResponseDTO(media);
      
    } catch (error: any) {
      console.error('Portfolio video upload failed:', error);
      throw createServiceError(
        error.message || 'Failed to upload portfolio video',
        error.status || 500
      );
    }
  }
  
  // GET FUNCTIONS
  
  /**
   * Get avatar by auth ID (Requirement 3.2.2)
   */
  async getAvatarByAuthId(authId: string): Promise<MediaResponseDTO | null> {
    try {
      const media = await prisma.media.findFirst({
        where: {
          authId,
          mediaType: MediaType.AVATAR
        }
      
      });
      console.log('MEDIA FROM PRISMA:', media);

      if (!media) {
        return null;
      }
      console.log('DB URL:', process.env.DATABASE_URL);

      return new MediaResponseDTO(media);
    } catch (error: any) {
      console.error('Failed to get avatar:', error);
      throw createServiceError(
        error.message || 'Failed to fetch avatar',
        error.status || 500
      );
    }
  }

  /**
   * Get media by ID
   */
  async getMediaById(mediaId: string): Promise<MediaResponseDTO> {
    try {
      const media = await prisma.media.findUnique({
        where: {
          id: mediaId,
          deletedAt: null
        }
      });

      if (!media) {
        throw createServiceError('Media not found', 404);
      }

      return new MediaResponseDTO(media);
    } catch (error: any) {
      console.error('Failed to get media by ID:', error);
      throw createServiceError(
        error.message || 'Failed to fetch media',
        error.status || 500
      );
    }
  }

  /**
   * Get portfolio items by auth ID with pagination (Requirement 3.2.4)
   */
  async getPortfolioByAuthId(
    authId: string,
    page: number = 1,
    limit: number = 20,
    mediaType?: MediaType
  ): Promise<{ items: MediaResponseDTO[], total: number, page: number, totalPages: number }> {
    try {
      const skip = (page - 1) * limit;
      
      // Build where clause
      const where: any = {
        authId,
        mediaType: {
          in: [MediaType.PORTFOLIO_IMAGE, MediaType.PORTFOLIO_VIDEO]
        }
      };

      if (mediaType) {
        where.mediaType = mediaType;
      }

      // Get total count
      const total = await prisma.media.count({ where });

      // Get paginated items
      const mediaItems = await prisma.media.findMany({
        where,
        orderBy: {
          uploadedAt: 'desc'
        },
        skip,
        take: limit
      });

      const items = await Promise.all(
        mediaItems.map(async (media) => {
          const signedUrl = await this.createSignedUrl(media.s3Key);

          return new MediaResponseDTO({
            ...media,
            s3Url: signedUrl,
          });
        })
      );

      const totalPages = Math.ceil(total / limit);

      return {
        items,
        total,
        page,
        totalPages
      };
    } catch (error: any) {
      console.error('Failed to get portfolio:', error);
      throw createServiceError(
        error.message || 'Failed to fetch portfolio',
        error.status || 500
      );
    }
  }

  /**
   * Get all media by auth ID (for admin/internal use)
   */
  async getAllMediaByAuthId(authId: string): Promise<MediaResponseDTO[]> {
    try {
      const mediaItems = await prisma.media.findMany({
        where: {
          authId,
          deletedAt: null
        },
        orderBy: {
          uploadedAt: 'desc'
        }
      });

      return mediaItems.map(media => new MediaResponseDTO(media));
    } catch (error: any) {
      console.error('Failed to get all media for auth:', error);
      throw createServiceError(
        error.message || 'Failed to fetch media',
        error.status || 500
      );
    }
  }

  /**
   * Get media by S3 key
   */
  async getMediaByS3Key(s3Key: string): Promise<MediaResponseDTO> {
    try {
      const media = await prisma.media.findFirst({
        where: {
          s3Key,
          deletedAt: null
        }
      });

      if (!media) {
        throw createServiceError('Media not found', 404);
      }

      return new MediaResponseDTO(media);
    } catch (error: any) {
      console.error('Failed to get media by S3 key:', error);
      throw createServiceError(
        error.message || 'Failed to fetch media',
        error.status || 500
      );
    }
  }

  /**
   * Search media by tags
   */
  async searchMediaByTags(
    tags: string[],
    authId?: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ items: MediaResponseDTO[], total: number, page: number, totalPages: number }> {
    try {
      const skip = (page - 1) * limit;
      
      const where: any = {
        tags: {
          hasSome: tags
        },
        deletedAt: null
      };

      if (authId) {
        where.authId = authId;
      }

      const total = await prisma.media.count({ where });

      const mediaItems = await prisma.media.findMany({
        where,
        orderBy: {
          uploadedAt: 'desc'
        },
        skip,
        take: limit
      });

      const items = mediaItems.map(media => new MediaResponseDTO(media));
      const totalPages = Math.ceil(total / limit);

      return {
        items,
        total,
        page,
        totalPages
      };
    } catch (error: any) {
      console.error('Failed to search media by tags:', error);
      throw createServiceError(
        error.message || 'Failed to search media',
        error.status || 500
      );
    }
  }

  /**
   * Get recent media (for feeds/timeline)
   */
  async getRecentMedia(
    excludeAuthId?: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ items: MediaResponseDTO[], total: number, page: number, totalPages: number }> {
    try {
      const skip = (page - 1) * limit;
      
      const where: any = {
        deletedAt: null,
        mediaType: {
          in: [MediaType.PORTFOLIO_IMAGE, MediaType.PORTFOLIO_VIDEO]
        }
      };

      if (excludeAuthId) {
        where.authId = {
          not: excludeAuthId
        };
      }

      const total = await prisma.media.count({ where });

      const mediaItems = await prisma.media.findMany({
        where,
        orderBy: {
          uploadedAt: 'desc'
        },
        skip,
        take: limit
      });

      const items = mediaItems.map(media => new MediaResponseDTO(media));
      const totalPages = Math.ceil(total / limit);

      return {
        items,
        total,
        page,
        totalPages
      };
    } catch (error: any) {
      console.error('Failed to get recent media:', error);
      throw createServiceError(
        error.message || 'Failed to fetch recent media',
        error.status || 500
      );
    }
  }

  /**
   * Get media statistics for an authId
   */
  async getMediaStats(authId: string): Promise<{
    totalMedia: number;
    totalImages: number;
    totalVideos: number;
    totalSize: number;
    lastUpload: Date | null;
  }> {
    try {
      const [
        totalMedia,
        totalImages,
        totalVideos,
        totalSizeResult,
        lastUpload
      ] = await Promise.all([
        // Total media count
        prisma.media.count({
          where: {
            authId,
            deletedAt: null
          }
        }),
        
        // Total images count
        prisma.media.count({
          where: {
            authId,
            mediaType: MediaType.PORTFOLIO_IMAGE,
            deletedAt: null
          }
        }),
        
        // Total videos count
        prisma.media.count({
          where: {
            authId,
            mediaType: MediaType.PORTFOLIO_VIDEO,
            deletedAt: null
          }
        }),
        
        // Total file size
        prisma.media.aggregate({
          where: {
            authId,
            deletedAt: null
          },
          _sum: {
            fileSize: true
          }
        }),
        
        // Last upload date
        prisma.media.findFirst({
          where: {
            authId,
            deletedAt: null
          },
          orderBy: {
            uploadedAt: 'desc'
          },
          select: {
            uploadedAt: true
          }
        })
      ]);

      return {
        totalMedia,
        totalImages,
        totalVideos,
        totalSize: totalSizeResult._sum.fileSize || 0,
        lastUpload: lastUpload?.uploadedAt || null
      };
    } catch (error: any) {
      console.error('Failed to get media stats:', error);
      throw createServiceError(
        error.message || 'Failed to fetch media statistics',
        error.status || 500
      );
    }
  }

  async createSignedUrl(s3Key: string, expiresIn = 3600) {
    return getSignedUrl(
      this.s3Client,
      new GetObjectCommand({
        Bucket: process.env.BUCKET_NAME!,
        Key: s3Key,
      }),
      { expiresIn }
    );
  }

  
}