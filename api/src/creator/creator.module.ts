import { Module } from '@nestjs/common';
import { CreatorService } from './creator.service';
import { CreatorController } from './creator.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [CreatorController],
  providers: [CreatorService, PrismaService],
})
export class CreatorModule {}
