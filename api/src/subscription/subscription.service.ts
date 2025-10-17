// src/subscription/subscription.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SubscriptionService {
  constructor(private prisma: PrismaService) {}

  async subscribe(patronId: number, tierId: number) {
    return this.prisma.subscription.create({
      data: { patronId, tierId },
    });
  }

  async getSubscriptions(patronId: number) {
    return this.prisma.subscription.findMany({
      where: { patronId },
      include: { tier: true },
    });
  }
}