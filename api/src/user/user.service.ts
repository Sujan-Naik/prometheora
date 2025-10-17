// src/user/user.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findById(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        handle: true,
        bio: true,
        createdAt: true,
        updatedAt: true,
        userRoles: {
          select: { role: true },
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

  async updateProfile(userId: number, data: { bio?: string; handle?: string }) {
    const updateData: any = {};
    if (data.bio !== undefined) updateData.bio = data.bio;
    if (data.handle !== undefined) updateData.handle = data.handle;

    return this.prisma.user.update({
      where: { id: userId },
      data: updateData,
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

  async updateAccount(userId: number, email?: string, password?: string) {
    const updateData: any = {};

    if (email) {
      updateData.email = email;
    }

    if (password) {
      const bcrypt = await import('bcrypt');
      updateData.passwordHash = await bcrypt.hash(password, 10);
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: updateData,
    });
  }
}