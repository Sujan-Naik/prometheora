// src/tier/tier.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TierService {
  constructor(private prisma: PrismaService) {}

  async createTier(creatorId: number, name: string, price: number, benefits: string) {
    return this.prisma.tier.create({
      data: { creatorId, name, price, benefits },
    });
  }

  // getTiers handled in CreatorService
}