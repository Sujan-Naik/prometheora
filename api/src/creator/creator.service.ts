import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Role } from '@prisma/client';

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

    const searchTerm = search?.trim();

    try {
      const where = searchTerm
        ? {
            userRoles: {
              some: {
                role: Role.CREATOR,
              },
            },
            OR: [
              { handle: { contains: searchTerm, mode: 'insensitive' as const } },
              { bio: { contains: searchTerm, mode: 'insensitive' as const } },
            ],
          }
        : {
            userRoles: {
              some: {
                role: Role.CREATOR,
              },
            },
          };

      const [creators, total] = await Promise.all([
        this.prisma.user.findMany({
          where,
          take: Math.min(limit, 100),
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
    } catch (error) {
      console.error('Error in discover:', error);
      throw error;
    }
  }

  async getProfile(handle: string) {
    const user = await this.prisma.user.findUnique({
      where: { handle },
      include: {
        posts: true,
        tiers: true,
        projects: true,
        portfolioItems: { include: { project: true } },
      },
    });

    if (!user) {
      throw new NotFoundException('Creator not found');
    }

    return user;
  }

  async getPosts(handle: string) {
    const creator = await this.prisma.user.findUnique({ where: { handle } });
    if (!creator) {
      throw new NotFoundException('Creator not found');
    }
    return this.prisma.post.findMany({
      where: { creatorId: creator.id },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getTiers(handle: string) {
    const creator = await this.prisma.user.findUnique({ where: { handle } });
    if (!creator) {
      throw new NotFoundException('Creator not found');
    }
    return this.prisma.tier.findMany({
      where: { creatorId: creator.id },
      orderBy: { price: 'asc' },
    });
  }

  async getAbout(handle: string) {
    const user = await this.prisma.user.findUnique({
      where: { handle },
      select: { bio: true, media: true },
    });

    if (!user) {
      throw new NotFoundException('Creator not found');
    }

    return user;
  }
}