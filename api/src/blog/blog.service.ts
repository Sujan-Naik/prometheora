// src/blog/blog.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class BlogService {
  constructor(private prisma: PrismaService) {}

  async getBlogs() {
    return this.prisma.blog.findMany();
  }

  async getBlogBySlug(slug: string) {
    return this.prisma.blog.findUnique({ where: { slug } });
  }

  async createBlog(title: string, content: string, slug: string) {
    return this.prisma.blog.create({
      data: { title, content, slug },
    });
  }
}