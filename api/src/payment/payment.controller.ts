// src/payment/payment.controller.ts
import { Controller, Get, Post as HttpPost, Body, UseGuards, Req } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @HttpPost()
  async recordPayment(@Req() req, @Body() body: { subscriptionId: number; amount: number }) {
    return this.paymentService.recordPayment(req.user.id, body.subscriptionId, body.amount);
  }

  @Get()
  async getPayments(@Req() req) {
    return this.paymentService.getPayments(req.user.id);
  }
}