import { Module } from '@nestjs/common';
import { PrismaService } from './common/prisma.service';
import { CampaignsModule } from './campaigns/campaigns.module';
import { WorkersModule } from './workers/workers.module';

@Module({
  imports: [CampaignsModule, WorkersModule],
  providers: [PrismaService],
})
export class AppModule {}
