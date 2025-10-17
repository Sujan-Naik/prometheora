import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import {PrismaService} from "../prisma.service";

@Injectable()
export class MediaService {
  private s3Client: S3Client;
  private bucketName: string;
  private publicUrl: string;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    const region = this.configService.get<string>('AWS_REGION');
    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY');
    const bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');
    const publicUrl = this.configService.get<string>('AWS_S3_PUBLIC_URL');

    if (!region || !accessKeyId || !secretAccessKey || !bucketName || !publicUrl) {
      throw new Error('Missing required AWS S3 configuration in environment variables');
    }

    this.s3Client = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
    this.bucketName = bucketName;
    this.publicUrl = publicUrl;
  }

  async uploadToS3(file: Express.Multer.File): Promise<string> {
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const key = `media/${fileName}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    });

    try {
      await this.s3Client.send(command);
      return `${this.publicUrl}/${key}`;
    } catch (error) {
      throw new BadRequestException('Failed to upload file to S3');
    }
  }

  async deleteFromS3(url: string): Promise<void> {
    const key = url.replace(`${this.publicUrl}/`, '');

    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    try {
      await this.s3Client.send(command);
    } catch (error) {
      console.error('Failed to delete file from S3:', error);
    }
  }

  async createMedia(data: {
    url: string;
    type?: string;
    caption?: string;
    order?: number;
    userId?: number;
    projectId?: number;
    postId?: number;
  }) {
    return this.prisma.media.create({
      data,
    });
  }

  async findAll(filters?: {
    userId?: number;
    projectId?: number;
    postId?: number;
  }) {
    return this.prisma.media.findMany({
      where: filters,
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async findOne(id: number) {
    return this.prisma.media.findUnique({
      where: { id },
    });
  }

  async updateMedia(id: number, data: {
    caption?: string;
    order?: number;
  }) {
    return this.prisma.media.update({
      where: { id },
      data,
    });
  }

  async deleteMedia(id: number) {
    const media = await this.prisma.media.findUnique({
      where: { id },
    });

    if (media) {
      await this.deleteFromS3(media.url);
      await this.prisma.media.delete({
        where: { id },
      });
    }

    return media;
  }

  getMediaType(mimetype: string): string {
    if (mimetype.startsWith('image/')) return 'image';
    if (mimetype.startsWith('video/')) return 'video';
    if (mimetype.startsWith('audio/')) return 'audio';
    return 'file';
  }
}