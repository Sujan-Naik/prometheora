// src/devlog/devlog.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class DevlogService {
  constructor(private prisma: PrismaService) {}

  async createDevlog(
    projectId: number,
    data: {
      title: string;
      content: string;
      version?: string;
      buildLink?: string;
    },
  ) {
    // Check if user owns the project - assume checked in controller or guard
    return this.prisma.devlog.create({
      data: { ...data, projectId },
    });
  }

async getDevlogsForProject(projectId: number) {
  return this.prisma.devlog.findMany({
    where: { projectId },
    orderBy: { createdAt: 'desc' },
    include: {
      project: {
        select: {
          id: true,
          title: true,
          description: true,
          visibility: true,
          creatorId: true,
        },
      },
    },
  });
}
}
