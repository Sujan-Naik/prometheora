// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';

type SafeUser = Omit<
  Prisma.UserGetPayload<{ include: { userRoles: true } }>,
  'passwordHash'
>;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(
    email: string,
    password: string,
    handle?: string,
    roles: ('CREATOR' | 'PATRON' | 'ADMIN')[] = [],
  ): Promise<SafeUser> {
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

    // ✅ Determine admin status (e.g. CREATORs are admins)
    const isAdmin = user.userRoles.some((r) => r.role === 'ADMIN');

    // ✅ Include isAdmin in the payload
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
