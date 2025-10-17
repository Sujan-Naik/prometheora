// src/devlog/devlog.controller.ts
import { Controller, Post, Get, Param, Body, UseGuards, Req } from '@nestjs/common';
import { DevlogService } from './devlog.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('devlogs')
export class DevlogController {
  constructor(private devlogService: DevlogService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createDevlog(@Req() req, @Body() body: { projectId: number; title: string; content: string; version?: string; buildLink?: string }) {
    // Add check if user owns project
    return this.devlogService.createDevlog(body.projectId, body);
  }

  @Get('project/:projectId')
  @UseGuards(JwtAuthGuard)
  async getDevlogs(@Param('projectId') projectId: string) {
    return this.devlogService.getDevlogsForProject(parseInt(projectId));
  }
}