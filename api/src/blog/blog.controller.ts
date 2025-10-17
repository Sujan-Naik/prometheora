// src/blog/blog.controller.ts
import { Controller, Get, Param, Post as HttpPost, Body, UseGuards } from '@nestjs/common';
import { BlogService } from './blog.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard'; // Apply if blogs are admin-only for create

@Controller('blogs')
export class BlogController {
  constructor(private blogService: BlogService) {}

  @Get()
  async getBlogs() {
    return this.blogService.getBlogs();
  }

  @Get(':slug')
  async getBlog(@Param('slug') slug: string) {
    return this.blogService.getBlogBySlug(slug);
  }

  @HttpPost()
  @UseGuards(JwtAuthGuard) // Assuming only authenticated users (e.g., admins) can create blogs
  async createBlog(@Body() body: { title: string; content: string; slug: string }) {
    return this.blogService.createBlog(body.title, body.content, body.slug);
  }
}