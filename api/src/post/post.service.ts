// src/post/post.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async createPost(
    creatorId: number,
    title: string,
    content: string,
    isPaid: boolean,
    quotedProjectId?: number,
  ) {
    return this.prisma.post.create({
      data: {
        creatorId,
        title,
        content,
        isPaid,
        quotedProjectId,
      },
      include: {
        creator: {
          select: {
            id: true,
            handle: true,
            email: true,
          },
        },
        quotedProject: true,
        media: {
          orderBy: [
            { order: 'asc' },
            { createdAt: 'desc' },
          ],
        },
      },
    });
  }

  async getAllPublicPosts() {
    return this.prisma.post.findMany({
      where: { isPaid: false },
      include: {
        creator: {
          select: {
            id: true,
            handle: true,
          },
        },
        quotedProject: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
        media: {
          orderBy: [
            { order: 'asc' },
            { createdAt: 'desc' },
          ],
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPostById(id: number, userId?: number) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            handle: true,
            email: true,
          },
        },
        quotedProject: true,
        media: {
          orderBy: [
            { order: 'asc' },
            { createdAt: 'desc' },
          ],
        },
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Check if post is paid and user has access
    if (post.isPaid && (!userId || post.creatorId !== userId)) {
      // Here you could add patron subscription check
      const hasAccess = await this.checkPostAccess(post.creatorId, userId);
      if (!hasAccess) {
        throw new NotFoundException('Post requires patron subscription');
      }
    }

    return post;
  }

  private async checkPostAccess(creatorId: number, userId?: number): Promise<boolean> {
    if (!userId) return false;

    // Check if user is the creator
    if (creatorId === userId) return true;

    // Check if user is a patron
    const subscription = await this.prisma.subscription.findFirst({
      where: {
        patronId: userId,
        tier: { creatorId },
        OR: [
          { endDate: null },
          { endDate: { gte: new Date() } },
        ],
      },
    });

    return !!subscription;
  }
}