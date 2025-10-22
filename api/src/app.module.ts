// src/app.module.ts (updated to include new modules)
import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CreatorModule } from './creator/creator.module';
import { PostModule } from './post/post.module';
import { TierModule } from './tier/tier.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { PaymentModule } from './payment/payment.module';
import { BlogModule } from './blog/blog.module';
import { ProjectModule } from './project/project.module';
import { DevlogModule } from './devlog/devlog.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import {MediaModule} from "./media/media.module";

@Module({
  imports: [
    AuthModule,
    UserModule,
    CreatorModule,
    PostModule,
    TierModule,
    SubscriptionModule,
    PaymentModule,
    BlogModule,
    ProjectModule,
    DevlogModule,
    PortfolioModule,
      MediaModule
  ],
  providers: [PrismaService],
})
export class AppModule {}