import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import { createServiceError } from '../../../../shared/utils';
import { PassThrough } from 'stream';

export class VideoProcessor {
  private ffmpegPath: string;
  
  constructor() {
    this.ffmpegPath = ffmpegPath || 'ffmpeg';
    ffmpeg.setFfmpegPath(this.ffmpegPath);
  }
  
  async getVideoMetadata(filePath: string): Promise<{
    duration: number;
    width: number;
    height: number;
    format: string;
  }> {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(filePath, (error, metadata) => {
        if (error) {
          console.error('Failed to get video metadata:', error);
          reject(createServiceError('Invalid video file', 400));
          return;
        }
        
        const videoStream = metadata.streams.find(stream => stream.codec_type === 'video');
        if (!videoStream) {
          reject(createServiceError('No video stream found', 400));
          return;
        }
        
        resolve({
          duration: Math.floor(metadata.format.duration || 0),
          width: videoStream.width || 0,
          height: videoStream.height || 0,
          format: metadata.format.format_name || 'unknown'
        });
      });
    });
  }
  
  async generateThumbnail(filePath: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const buffers: Buffer[] = [];
      const stream = new PassThrough();
      
      ffmpeg(filePath)
        .screenshots({
          timestamps: ['50%'],
          filename: 'thumbnail.jpg',
          size: '640x360',
          folder: '/tmp'
        })
        .on('end', () => {
          // For now, return empty buffer (we'll handle this properly later)
          resolve(Buffer.from([]));
        })
        .on('error', (error) => {
          console.error('Failed to generate thumbnail:', error);
          reject(createServiceError('Failed to generate thumbnail', 500));
        });
    });
  }
  
  validateVideo(filePath: string, maxDuration: number = 300): Promise<boolean> {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(filePath, (error, metadata) => {
        if (error) {
          reject(createServiceError('Invalid video file', 400));
          return;
        }
        
        const duration = metadata.format.duration || 0;
        if (duration > maxDuration) {
          reject(createServiceError(`Video too long. Max ${maxDuration} seconds`, 400));
          return;
        }
        
        resolve(true);
      });
    });
  }
}