import { Controller, Post, Body } from '@nestjs/common';
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
      handle?: string;
      roles?: ('CREATOR' | 'PATRON')[];
    },
  ) {
    return this.authService.signup(
      body.email,
      body.password,
      body.handle,
      body.roles ?? [],
    );
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }
}
