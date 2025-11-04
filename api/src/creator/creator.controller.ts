import { Controller, Get, Param, Query, UseGuards, Request } from '@nestjs/common';
import { CreatorService } from './creator.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('creators')
export class CreatorController {
  constructor(private creatorService: CreatorService) {}

  // Public routes - no auth required
  @Get()
  async discover(
    @Query('search') search?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.creatorService.discover({
      search,
      limit: limit ? parseInt(limit) : 20,
      offset: offset ? parseInt(offset) : 0,
    });
  }

  // Protected routes - auth required
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMyProfile(@Request() req) {
    return this.creatorService.getProfileByUserId(req.user.id);
  }

  @Get('me/projects')
  @UseGuards(JwtAuthGuard)
  async getMyProjects(@Request() req) {
    return this.creatorService.getProjectsByUserId(req.user.id);
  }

  // Public profile routes - no auth required
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