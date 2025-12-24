export enum MediaType {
  AVATAR = 'AVATAR',
  PORTFOLIO_IMAGE = 'PORTFOLIO_IMAGE',
  PORTFOLIO_VIDEO = 'PORTFOLIO_VIDEO'
}

export class MediaResponseDTO {
  id: string;
  authId: string;            
  mediaType: MediaType;
  s3Key: string;
  s3Url: string;
  thumbnailKey?: string;
  thumbnailUrl?: string;
  fileSize: number;
  mimeType: string;
  width?: number;
  height?: number;
  duration?: number;
  title?: string;
  description?: string;
  tags: string[];
  uploadedAt: Date;
  processedAt?: Date;

  constructor(media: any) {
    this.id = media.id;
    this.authId = media.authId; // ✅ FIX
    this.mediaType = media.mediaType;
    this.s3Key = media.s3Key;
    this.s3Url = media.s3Url;
    this.thumbnailKey = media.thumbnailKey;
    this.thumbnailUrl = media.thumbnailUrl;
    this.fileSize = media.fileSize;
    this.mimeType = media.mimeType;
    this.width = media.width;
    this.height = media.height;
    this.duration = media.duration;
    this.title = media.title;
    this.description = media.description;
    this.tags = media.tags || [];
    this.uploadedAt = media.uploadedAt;
    this.processedAt = media.processedAt;
  }

}
