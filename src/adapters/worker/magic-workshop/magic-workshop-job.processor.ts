import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { MagicWorkshopJobHandler } from './magic-workshop-job.handler';
import {
  MAGIC_CRAFT_JOB_NAME,
  MAGIC_WORKSHOP_QUEUE_NAME,
  type MagicCraftJob,
  type MagicCraftResult,
} from './magic-workshop-job.mapper';

@Injectable()
@Processor(MAGIC_WORKSHOP_QUEUE_NAME)
export class MagicWorkshopJobProcessor extends WorkerHost {
  constructor(private readonly handler: MagicWorkshopJobHandler) {
    super();
  }

  async process(job: MagicCraftJob): Promise<MagicCraftResult> {
    if (job.name === MAGIC_CRAFT_JOB_NAME) {
      return await this.handler.processCraft({ job });
    }
    throw new Error('Unsupported magic workshop job');
  }

  @OnWorkerEvent('completed')
  async onCompleted(job: MagicCraftJob): Promise<void> {
    if (job.name === MAGIC_CRAFT_JOB_NAME) {
      await this.handler.onCraftCompleted({ job });
      return;
    }
    throw new Error('Unsupported magic workshop job');
  }

  @OnWorkerEvent('failed')
  async onFailed(job: MagicCraftJob | undefined, error: Error): Promise<void> {
    await this.handler.onCraftFailed({ job: job, error });
  }
}
