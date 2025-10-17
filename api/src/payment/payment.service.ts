// src/payment/payment.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  async recordPayment(userId: number, subscriptionId: number, amount: number) {
    return this.prisma.payment.create({
      data: { userId, subscriptionId, amount },
    });
  }

  async getPayments(userId: number) {
    return this.prisma.payment.findMany({
      where: { userId },
      include: { subscription: true },
    });
  }
}