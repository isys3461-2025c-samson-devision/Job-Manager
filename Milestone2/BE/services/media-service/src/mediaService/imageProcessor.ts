// src/services/ImageProcessor.ts
import sharp from 'sharp';
import { createServiceError } from '../../../../shared/utils';

export class ImageProcessor {
  private readonly avatarConfig = {
    width: 400,
    height: 400,
    format: 'webp' as const,
    quality: 85
  };
  
  private readonly portfolioConfig = {
    width: 1200,
    height: 800,
    format: 'webp' as const,
    quality: 80
  };
  
  async processAvatar(buffer: Buffer): Promise<{ 
    processedBuffer: Buffer; 
    width: number; 
    height: number 
  }> {
    try {
      const image = sharp(buffer);
      
      // Get image metadata
      const metadata = await image.metadata();
      
      // Resize and convert to webp
      const processedBuffer = await image
        .resize(this.avatarConfig.width, this.avatarConfig.height, {
          fit: 'cover',
          position: 'center'
        })
        .webp({ quality: this.avatarConfig.quality })
        .toBuffer();
      
      return {
        processedBuffer,
        width: this.avatarConfig.width,
        height: this.avatarConfig.height
      };
      
    } catch (error) {
      console.error('Failed to process avatar:', error);
      throw createServiceError('Failed to process image', 500);
    }
  }
  
  async processPortfolioImage(buffer: Buffer): Promise<{
    processedBuffer: Buffer;
    width: number;
    height: number;
    thumbnailBuffer: Buffer;
  }> {
    try {
      const image = sharp(buffer);
      const metadata = await image.metadata();
      
      // Resize main image
      const processedBuffer = await image
        .resize(this.portfolioConfig.width, this.portfolioConfig.height, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .webp({ quality: this.portfolioConfig.quality })
        .toBuffer();
      
      // Create thumbnail (300x300)
      const thumbnailBuffer = await sharp(buffer)
        .resize(300, 300, {
          fit: 'cover',
          position: 'center'
        })
        .webp({ quality: 75 })
        .toBuffer();
      
      return {
        processedBuffer,
        width: metadata.width || this.portfolioConfig.width,
        height: metadata.height || this.portfolioConfig.height,
        thumbnailBuffer
      };
      
    } catch (error) {
      console.error('Failed to process portfolio image:', error);
      throw createServiceError('Failed to process image', 500);
    }
  }
  
  async getImageMetadata(buffer: Buffer): Promise<{
    width: number;
    height: number;
    format: string;
  }> {
    try {
      const metadata = await sharp(buffer).metadata();
      return {
        width: metadata.width || 0,
        height: metadata.height || 0,
        format: metadata.format || 'unknown'
      };
    } catch (error) {
      console.error('Failed to get image metadata:', error);
      throw createServiceError('Invalid image file', 400);
    }
  }
}