// src/post/post.controller.ts
import { Controller, Post as HttpPost, Get, Body, UseGuards, Req, Param } from '@nestjs/common';
import { PostService } from './post.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  @HttpPost()
  @UseGuards(JwtAuthGuard)
  async createPost(
    @Req() req,
    @Body() body: {
      title: string;
      content: string;
      isPaid: boolean;
      quotedProjectId?: number;
    },
  ) {
    return this.postService.createPost(
      req.user.id,
      body.title,
      body.content,
      body.isPaid,
      body.quotedProjectId,
    );
  }

  @Get()
  async getAllPublicPosts() {
    return this.postService.getAllPublicPosts();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getPost(@Param('id') id: string, @Req() req) {
    return this.postService.getPostById(parseInt(id), req.user?.id);
  }
}