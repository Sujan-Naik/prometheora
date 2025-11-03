import { Controller, Post, Body, HttpCode, HttpStatus, BadRequestException, ConflictException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(
    @Body()
    body: {
      email: string;
      password: string;
      inviteCode: string;
      handle?: string;
      roles?: ('CREATOR' | 'PATRON')[];
    },
  ) {
    try {
      return await this.authService.signup(
        body.email,
        body.password,
        body.inviteCode,
        body.handle,
        body.roles ?? ['PATRON'],
      );
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Email or handle already exists');
      }
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Signup failed');
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: { email: string; password: string }) {
    try {
      return await this.authService.login(body.email, body.password);
    } catch {
      throw new BadRequestException('Invalid credentials');
    }
  }
}