import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

interface DiscoverOptions {
  search?: string;
  limit: number;
  offset: number;
}

@Injectable()
export class CreatorService {
  constructor(private prisma: PrismaService) {}

  async discover(options: DiscoverOptions) {
    const { search, limit, offset } = options;

    const where = search
      ? {
          OR: [
            { handle: { contains: search, mode: 'insensitive' as const } },
            { bio: { contains: search, mode: 'insensitive' as const } },
          ],
          roles: { has: 'CREATOR' },
        }
      : { roles: { has: 'CREATOR' } };

    const [creators, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        take: limit,
        skip: offset,
        select: {
          id: true,
          handle: true,
          bio: true,
          createdAt: true,
          _count: {
            select: {
              posts: true,
              projects: true,
              tiers: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      creators,
      total,
      limit,
      offset,
    };
  }

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
    return this.prisma.user.findUnique({
      where: { handle },
      select: { bio: true, media: true },
    });
  }
}