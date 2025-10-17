// src/devlog/devlog.module.ts
import { Module } from '@nestjs/common';
import { DevlogService } from './devlog.service';
import { DevlogController } from './devlog.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [DevlogController],
  providers: [DevlogService, PrismaService],
})
export class DevlogModule {}
