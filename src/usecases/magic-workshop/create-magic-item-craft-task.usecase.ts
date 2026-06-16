import { Injectable } from '@nestjs/common';
import { BULLMQ_JOBS, BULLMQ_QUEUES } from '@src/infrastructure/bullmq/bullmq.constants';
import { BullMqProducerGateway } from '@src/infrastructure/bullmq/producer.gateway';
import { MagicWorkshopService } from '@src/modules/magic-workshop/magic-workshop.service';
import type {
  CreateMagicItemCraftInput,
  MagicItemCraftResult,
} from '@src/modules/magic-workshop/magic-workshop.types';

@Injectable()
export class CreateMagicItemCraftTaskUsecase {
  constructor(
    private readonly workshopService: MagicWorkshopService,
    private readonly producer: BullMqProducerGateway,
  ) {}

  async execute(input: CreateMagicItemCraftInput): Promise<MagicItemCraftResult> {
    const craftEntity = await this.workshopService.createCraftTask(input);

    const payload = this.workshopService.toPayload(craftEntity);
    const job = await this.producer.enqueue({
      queueName: BULLMQ_QUEUES.MAGIC_WORKSHOP,
      jobName: BULLMQ_JOBS.MAGIC_WORKSHOP.CRAFT,
      payload,
      traceId: `magic-craft:${craftEntity.id}`,
    });

    await this.workshopService.updateJobId(craftEntity.id, job.jobId);

    return {
      id: craftEntity.id,
      status: craftEntity.status,
      itemName: craftEntity.itemName,
      createdAt: craftEntity.createdAt,
    };
  }
}
