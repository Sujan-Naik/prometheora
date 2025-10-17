// src/project/project.service.ts
import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Visibility } from '@prisma/client';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  async createProject(
    creatorId: number,
    data: {
      title: string;
      description: string;
      repoUrl?: string;
      demoUrl?: string;
      status?: string;
      visibility: Visibility;
    },
  ) {
    return this.prisma.project.create({
      data: { ...data, creatorId },
      include: {
        creator: {
          select: {
            id: true,
            handle: true,
            email: true,
          },
        },
        media: {
          orderBy: [
            { order: 'asc' },
            { createdAt: 'desc' },
          ],
        },
      },
    });
  }

  async getProjectsForCreator(handle: string, userId?: number) {
    const creator = await this.prisma.user.findUnique({ where: { handle } });
    if (!creator) {
      throw new NotFoundException('Creator not found');
    }

    // Filter projects based on visibility and user access
    const projects = await this.prisma.project.findMany({
      where: { creatorId: creator.id },
      include: {
        creator: {
          select: {
            id: true,
            handle: true,
          },
        },
        media: {
          orderBy: [
            { order: 'asc' },
            { createdAt: 'desc' },
          ],
        },
        followers: userId ? { where: { userId } } : false,
        _count: {
          select: { followers: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Filter out projects the user shouldn't see
    const accessibleProjects: typeof projects = [];
    for (const project of projects) {
      try {
        await this.checkAccess(project, userId);
        accessibleProjects.push(project);
      } catch {
        // Skip projects user doesn't have access to
      }
    }

    return accessibleProjects;
  }

  async getProjectById(id: number, userId?: number) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            handle: true,
            email: true,
          },
        },
        followers: userId ? { where: { userId } } : false,
        devlogs: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        media: {
          orderBy: [
            { order: 'asc' },
            { createdAt: 'desc' },
          ],
        },
        _count: {
          select: { followers: true },
        },
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    await this.checkAccess(project, userId);

    return project;
  }

  async updateProject(
    projectId: number,
    userId: number,
    data: {
      title?: string;
      description?: string;
      repoUrl?: string;
      demoUrl?: string;
      status?: string;
      visibility?: Visibility;
    },
  ) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.creatorId !== userId) {
      throw new ForbiddenException('You can only update your own projects');
    }

    return this.prisma.project.update({
      where: { id: projectId },
      data,
      include: {
        media: {
          orderBy: [
            { order: 'asc' },
            { createdAt: 'desc' },
          ],
        },
      },
    });
  }

  private async checkAccess(project: any, userId?: number) {
    if (project.visibility === Visibility.PUBLIC) {
      return true;
    }

    if (!userId) {
      throw new ForbiddenException('Authentication required');
    }

    if (project.creatorId === userId) {
      return true;
    }

    if (project.visibility === Visibility.PRIVATE) {
      throw new ForbiddenException('Private project');
    }

    if (project.visibility === Visibility.FOLLOWER_ONLY) {
      const isFollowing = project.followers && project.followers.length > 0;
      if (!isFollowing) {
        throw new ForbiddenException('Project is follower-only');
      }
    }

    if (project.visibility === Visibility.PATRON_ONLY) {
      const isPatron = await this.prisma.subscription.findFirst({
        where: {
          patronId: userId,
          tier: { creatorId: project.creatorId },
          OR: [
            { endDate: null },
            { endDate: { gte: new Date() } },
          ],
        },
      });
      if (!isPatron) {
        throw new ForbiddenException('Project is patron-only');
      }
    }

    return true;
  }

  async followProject(userId: number, projectId: number) {
    const existing = await this.prisma.projectFollower.findFirst({
      where: { userId, projectId },
    });

    if (existing) {
      return existing;
    }

    return this.prisma.projectFollower.create({
      data: { userId, projectId },
    });
  }

  async unfollowProject(userId: number, projectId: number) {
    return this.prisma.projectFollower.deleteMany({
      where: { userId, projectId },
    });
  }

  async getFollowedProjectsFeed(userId: number) {
  const followed = await this.prisma.projectFollower.findMany({
    where: { userId },
    include: {
      project: {
        include: {
          creator: {
            select: {
              id: true,
              handle: true,
            },
          },
          devlogs: {
            include: {
              project: {
                select: {
                  id: true,
                  title: true,
                  description: true,
                  visibility: true,
                  creatorId: true,
                  creator: {  // Nest creator under project's select
                    select: {
                      id: true,
                      handle: true,
                    },
                  },
                },
              },
            },
            orderBy: { createdAt: 'desc' },
          },
          media: {  // Keep if needed, or remove for optimization
            orderBy: [
              { order: 'asc' },
              { createdAt: 'desc' },
            ],
            take: 1,
          },
        },
      },
    },
  });

  const feed = followed
    .flatMap((fp) => fp.project.devlogs)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return feed;
}
}