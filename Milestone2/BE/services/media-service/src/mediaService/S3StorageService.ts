// src/services/S3StorageService.ts
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { createServiceError } from '../../../../shared/utils';

export class S3StorageService {
  private s3Client: S3Client;
  private bucketName: string;
  
  constructor() {
    console.log('AWS Region:', process.env.AWS_REGION);
    console.log('S3 Bucket:', process.env.BUCKET_NAME);
    console.log('Access Key:', process.env.ACCESS_KEY);
    console.log('Secret Access Key:', process.env.SECRET_KEY);
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.ACCESS_KEY!,
        secretAccessKey: process.env.SECRET_KEY!
      }
    });
    
    this.bucketName = process.env.BUCKET_NAME!;
    
    if (!this.bucketName) {
      throw new Error('BUCKET_NAME is not set');
    }
  }
  
  /**
   * Upload file to S3
   */
  async uploadFile(
    buffer: Buffer,
    key: string,
    contentType: string,
    metadata?: Record<string, string>
  ): Promise<{ key: string; url: string }> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: buffer,
        ContentType: contentType,
        Metadata: metadata
      });
      
      await this.s3Client.send(command);
      
      // Generate public URL
      const url = `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
      
      return { key, url };
      
    } catch (error: any) {
      console.error('S3 upload error:', error);
      throw createServiceError('Failed to upload file to S3', 500);
    }
  }
  
  /**
   * Delete file from S3
   */
  async deleteFile(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key
      });
      
      await this.s3Client.send(command);
      
    } catch (error: any) {
      console.error('S3 delete error:', error);
      throw createServiceError('Failed to delete file from S3', 500);
    }
  }
  
  /**
   * Generate signed URL for private files (if needed)
   */
  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key
      });
      
      return await getSignedUrl(this.s3Client, command, { expiresIn });
      
    } catch (error: any) {
      console.error('S3 signed URL error:', error);
      throw createServiceError('Failed to generate download URL', 500);
    }
  }
  
  /**
   * Generate S3 key for organized storage
   */
// In S3StorageService
  generateKey(authId: string, folder: string, originalName: string, isThumbnail: boolean = false): string {
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 8);
      const extension = originalName.split('.').pop();
      const baseName = originalName.replace(/\.[^/.]+$/, ""); // Remove extension
      const thumbnailSuffix = isThumbnail ? '_thumb' : '';
      return `${authId}/${folder}/${baseName}_${timestamp}_${randomString}${thumbnailSuffix}.${extension}`;
  }
}