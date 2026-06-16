import { Module } from '@nestjs/common';
import { BullMqModule } from '@src/infrastructure/bullmq/bullmq.module';
import { MagicWorkshopModule } from '@src/modules/magic-workshop/magic-workshop.module';
import { MagicWorkshopJobHandler } from './magic-workshop-job.handler';
import { MagicWorkshopJobProcessor } from './magic-workshop-job.processor';

@Module({
  imports: [MagicWorkshopModule, BullMqModule],
  providers: [MagicWorkshopJobHandler, MagicWorkshopJobProcessor],
})
export class MagicWorkshopWorkerAdapterModule {}
