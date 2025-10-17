// src/creator/creator.service.ts (updated to include projects and portfolio)
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CreatorService {
  constructor(private prisma: PrismaService) {}

  async getProfile(handle: string) {
    return this.prisma.user.findUnique({
      where: { handle },
      include: {
        posts: true,
        tiers: true,
        projects: true,
        portfolioItems: { include: { project: true } },
      },
    });
  }

  async getPosts(handle: string) {
    const creator = await this.prisma.user.findUnique({ where: { handle } });
    if (!creator) {
      throw new NotFoundException('Creator not found');
    }
    return this.prisma.post.findMany({ where: { creatorId: creator.id } });
  }

  async getTiers(handle: string) {
    const creator = await this.prisma.user.findUnique({ where: { handle } });
    if (!creator) {
      throw new NotFoundException('Creator not found');
    }
    return this.prisma.tier.findMany({ where: { creatorId: creator.id } });
  }

  async getAbout(handle: string) {
    return this.prisma.user.findUnique({ where: { handle }, select: { bio: true, media: true } });
  }
}