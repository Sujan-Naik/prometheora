// src/portfolio/portfolio.controller.ts
import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('portfolio')
export class PortfolioController {
  constructor(private portfolioService: PortfolioService) {}

  @Get(':handle')
  async getPortfolio(@Param('handle') handle: string) {
    return this.portfolioService.getPortfolio(handle);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async addToPortfolio(@Req() req, @Body() body: { projectId: number; caption?: string }) {
    return this.portfolioService.addToPortfolio(req.user.id, body.projectId, body.caption);
  }

  @Patch('order')
  @UseGuards(JwtAuthGuard)
  async updateOrder(@Req() req, @Body() body: { items: { id: number; order: number }[] }) {
    return this.portfolioService.updatePortfolioOrder(req.user.id, body.items);
  }

  @Delete(':itemId')
  @UseGuards(JwtAuthGuard)
  async removeFromPortfolio(@Req() req, @Param('itemId') itemId: string) {
    return this.portfolioService.removeFromPortfolio(req.user.id, parseInt(itemId));
  }
}