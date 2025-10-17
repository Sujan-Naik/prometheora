// src/subscription/subscription.controller.ts
import { Controller, Get, Post as HttpPost, Body, UseGuards, Req } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('subscriptions')
@UseGuards(JwtAuthGuard)
export class SubscriptionController {
  constructor(private subscriptionService: SubscriptionService) {}

  @HttpPost()
  async subscribe(@Req() req, @Body() body: { tierId: number }) {
    return this.subscriptionService.subscribe(req.user.id, body.tierId);
  }

  @Get()
  async getSubscriptions(@Req() req) {
    return this.subscriptionService.getSubscriptions(req.user.id);
  }
}