// src/project/project.controller.ts
import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import { ProjectService } from './project.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { Visibility } from '@prisma/client';

@Controller('projects')
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createProject(
    @Req() req,
    @Body()
    body: {
      title: string;
      description: string;
      repoUrl?: string;
      demoUrl?: string;
      status?: string;
      visibility: Visibility;
    },
  ) {
    return this.projectService.createProject(req.user.id, body);
  }

  @Get('creator/:handle')
  @UseGuards(JwtAuthGuard)
  async getProjectsForCreator(@Param('handle') handle: string, @Req() req) {
    return this.projectService.getProjectsForCreator(handle, req.user?.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getProject(@Param('id') id: string, @Req() req) {
    return this.projectService.getProjectById(parseInt(id), req.user?.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateProject(
    @Req() req,
    @Param('id') id: string,
    @Body()
    body: {
      title?: string;
      description?: string;
      repoUrl?: string;
      demoUrl?: string;
      status?: string;
      visibility?: Visibility;
    },
  ) {
    return this.projectService.updateProject(parseInt(id), req.user.id, body);
  }

  @Post(':id/follow')
  @UseGuards(JwtAuthGuard)
  async followProject(@Req() req, @Param('id') id: string) {
    return this.projectService.followProject(req.user.id, parseInt(id));
  }

  @Delete(':id/follow')
  @UseGuards(JwtAuthGuard)
  async unfollowProject(@Req() req, @Param('id') id: string) {
    return this.projectService.unfollowProject(req.user.id, parseInt(id));
  }

  @Get('followed/feed')
  @UseGuards(JwtAuthGuard)
  async getFollowedFeed(@Req() req) {
    return this.projectService.getFollowedProjectsFeed(req.user.id);
  }
}