import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { emailQueue } from '../workers/email.queue';

@Injectable()
export class CampaignsService {
  constructor(private prisma: PrismaService) {}

  async sendCampaign(campaignId: string) {
    const campaign = await this.prisma.campaign.findUnique({
      where: { id: campaignId },
    });

    const subs = await this.prisma.listSubscriber.findMany({
      where: { listId: campaign!.listId },
      include: { subscriber: true },
    });

    for (const s of subs) {
      await emailQueue.add('send', {
        to: s.subscriber.email,
        subject: campaign!.subject,
        body: campaign!.body,
      });
    }

    return { queued: subs.length };
  }
}
