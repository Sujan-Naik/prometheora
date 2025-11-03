// src/auth/auth.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User, UserRole } from '@prisma/client';

type SafeUser = Omit<User & { userRoles: UserRole[] }, 'passwordHash'>;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(
    email: string,
    password: string,
    inviteCode: string,
    handle?: string,
    roles: ('CREATOR' | 'PATRON' | 'ADMIN')[] = [],
  ): Promise<SafeUser> {
    // Check invite code
    const validInviteCode = process.env.INVITE_CODE;

    if (!validInviteCode) {
      throw new BadRequestException('Signups are currently closed');
    }

    if (inviteCode !== validInviteCode) {
      throw new BadRequestException('Invalid invite code');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        handle,
        userRoles: {
          create: roles.map((role) => ({ role })),
        },
      },
      include: { userRoles: true },
    });

    const { passwordHash: _, ...safeUser } = user;
    return safeUser;
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { userRoles: true },
    });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new Error('Invalid credentials');
    }

    const isAdmin = user.userRoles.some((r) => r.role === 'ADMIN');

    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.userRoles.map((r) => r.role),
      isAdmin,
    };

    return { access_token: this.jwtService.sign(payload) };
  }

  async validateUser(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: { userRoles: true },
    });
  }
}