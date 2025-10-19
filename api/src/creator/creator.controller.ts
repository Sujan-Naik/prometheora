import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { CreatorService } from './creator.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('creators')
@UseGuards(JwtAuthGuard)
export class CreatorController {
  constructor(private creatorService: CreatorService) {}

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