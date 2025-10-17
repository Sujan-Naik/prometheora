// src/user/user.controller.ts
import { Controller, Get, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  async getMe(@Req() req) {
    return this.userService.findById(req.user.id);
  }

  @Get('profile')
  async getProfile(@Req() req) {
    return this.userService.findById(req.user.id);
  }

  @Patch('profile')
  async updateProfile(@Req() req, @Body() body: { bio?: string; handle?: string }) {
    return this.userService.updateProfile(req.user.id, body);
  }

  @Patch('account')
  async updateAccount(@Req() req, @Body() body: { email?: string; password?: string }) {
    return this.userService.updateAccount(req.user.id, body.email, body.password);
  }
}