// src/tier/tier.controller.ts
import { Controller, Post as HttpPost, Body, UseGuards, Req } from '@nestjs/common';
import { TierService } from './tier.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('tiers')
export class TierController {
  constructor(private tierService: TierService) {}

  @HttpPost()
  @UseGuards(JwtAuthGuard)
  async createTier(@Req() req, @Body() body: { name: string; price: number; benefits: string }) {
    return this.tierService.createTier(req.user.id, body.name, body.price, body.benefits);
  }
}