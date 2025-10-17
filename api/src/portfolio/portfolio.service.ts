// src/portfolio/portfolio.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PortfolioService {
  constructor(private prisma: PrismaService) {}

  async getPortfolio(handle: string) {
  const user = await this.prisma.user.findUnique({ where: { handle } });
  if (!user) {
    throw new NotFoundException('User not found');
  }
  return this.prisma.portfolioItem.findMany({
    where: { userId: user.id },
    include: {
      project: {
        include: {
          creator: true,
          media: true  // Add this to include media data
        }
      }
    },
    orderBy: { order: 'asc' },
  });
}

  async addToPortfolio(userId: number, projectId: number, caption?: string) {
    const count = await this.prisma.portfolioItem.count({ where: { userId } });
    return this.prisma.portfolioItem.create({
      data: { userId, projectId, order: count + 1, caption },
    });
  }

  async updatePortfolioOrder(userId: number, items: { id: number; order: number }[]) {
    return this.prisma.$transaction(
      items.map(item => this.prisma.portfolioItem.update({
        where: { id: item.id, userId },
        data: { order: item.order },
      }))
    );
  }

  async removeFromPortfolio(userId: number, itemId: number) {
    return this.prisma.portfolioItem.delete({ where: { id: itemId, userId } });
  }
}