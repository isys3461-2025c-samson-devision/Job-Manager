import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { createServiceError } from '../../../../shared/utils';

export class StorageService {
  private uploadDir: string;
  
  constructor() {
    this.uploadDir = process.env.UPLOAD_DIR || './uploads';
    this.ensureUploadDir();
  }
  
  private async ensureUploadDir() {
    try {
      await fs.mkdir(this.uploadDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create upload directory:', error);
      throw createServiceError('Storage initialization failed', 500);
    }
  }
  
  async saveFile(
    buffer: Buffer,
    originalName: string,
    mediaType: string,
    profileId: string
  ): Promise<{ fileName: string; filePath: string; url: string }> {
    try {
      // Create profile directory if it doesn't exist
      const profileDir = path.join(this.uploadDir, profileId);
      await fs.mkdir(profileDir, { recursive: true });
      
      // Generate unique filename
      const extension = path.extname(originalName);
      const fileName = `${mediaType.toLowerCase()}_${uuidv4()}${extension}`;
      const filePath = path.join(profileDir, fileName);
      
      // Save file
      await fs.writeFile(filePath, buffer);
      
      // Generate URL (for local development)
      const url = `/api/media/files/${profileId}/${fileName}`;
      
      return { fileName, filePath, url };
      
    } catch (error: any) {
      console.error('Failed to save file:', error);
      throw createServiceError('Failed to save file', 500);
    }
  }
  
  async deleteFile(filePath: string): Promise<void> {
    try {
      await fs.unlink(filePath);
    } catch (error: any) {
      console.error('Failed to delete file:', error);
      // Don't throw error if file doesn't exist
    }
  }
  
  async getFileBuffer(filePath: string): Promise<Buffer> {
    try {
      return await fs.readFile(filePath);
    } catch (error: any) {
      console.error('Failed to read file:', error);
      throw createServiceError('File not found', 404);
    }
  }
  
  async getFileStats(filePath: string): Promise<any> {
    try {
      return await fs.stat(filePath);
    } catch (error: any) {
      console.error('Failed to get file stats:', error);
      throw createServiceError('File not found', 404);
    }
  }
}