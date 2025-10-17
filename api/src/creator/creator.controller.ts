import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { CreatorService } from './creator.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('creators')
@UseGuards(JwtAuthGuard) // Apply where needed
export class CreatorController {
  constructor(private creatorService: CreatorService) {}

  @Get(':handle')
  async getProfile(@Param('handle') handle: string) {
    return this.creatorService.getProfile(handle);
  }

  @Get(':handle/posts')
  async getPosts(@Param('handle') handle: string) {
    return this.creatorService.getPosts(handle);
  }

  @Get(':handle/tiers')
  async getTiers(@Param('handle') handle: string) {
    return this.creatorService.getTiers(handle);
  }

  @Get(':handle/about')
  async getAbout(@Param('handle') handle: string) {
    return this.creatorService.getAbout(handle);
  }
}