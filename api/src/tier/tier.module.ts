// src/tier/tier.module.ts
import { Module } from '@nestjs/common';
import { TierService } from './tier.service';
import { TierController } from './tier.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [TierController],
  providers: [TierService, PrismaService],
})
export class TierModule {}