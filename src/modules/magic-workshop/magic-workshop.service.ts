import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MagicItemCraftEntity } from './magic-item-craft.entity';
import {
  type CreateMagicItemCraftInput,
  type MagicItemCraftDetail,
  type MagicItemCraftPayload,
  MagicItemCraftStatus,
  MagicItemQuality,
} from './magic-workshop.types';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MagicWorkshopService {
  constructor(
    @InjectRepository(MagicItemCraftEntity)
    private readonly craftRepository: Repository<MagicItemCraftEntity>,
  ) {}

  async createCraftTask(input: CreateMagicItemCraftInput): Promise<MagicItemCraftEntity> {
    const entity = this.craftRepository.create({
      id: uuidv4(),
      itemName: input.itemName,
      itemType: input.itemType,
      materialLevel: input.materialLevel,
      requestNote: input.requestNote ?? null,
      status: MagicItemCraftStatus.PENDING,
    });
    return await this.craftRepository.save(entity);
  }

  async findById(id: string): Promise<MagicItemCraftEntity | null> {
    return await this.craftRepository.findOneBy({ id });
  }

  async updateJobId(craftId: string, jobId: string): Promise<void> {
    await this.craftRepository.update(craftId, { jobId });
  }

  async updateStatusProcessing(craftId: string): Promise<void> {
    await this.craftRepository.update(craftId, {
      status: MagicItemCraftStatus.PROCESSING,
    });
  }

  async updateStatusSucceeded(
    craftId: string,
    qualityLevel: MagicItemQuality,
    resultDescription: string,
    craftLog: string,
  ): Promise<void> {
    await this.craftRepository.update(craftId, {
      status: MagicItemCraftStatus.SUCCEEDED,
      qualityLevel: qualityLevel,
      resultDescription,
      craftLog,
    });
  }

  async updateStatusFailed(craftId: string, failureReason: string): Promise<void> {
    await this.craftRepository.update(craftId, {
      status: MagicItemCraftStatus.FAILED,
      failureReason,
    });
  }

  toDetail(entity: MagicItemCraftEntity): MagicItemCraftDetail {
    return {
      id: entity.id,
      itemName: entity.itemName,
      itemType: entity.itemType,
      status: entity.status,
      qualityLevel: entity.qualityLevel ?? undefined,
      resultDescription: entity.resultDescription ?? undefined,
      craftLog: entity.craftLog ?? undefined,
      failureReason: entity.failureReason ?? undefined,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  toPayload(entity: MagicItemCraftEntity): MagicItemCraftPayload {
    return {
      craftId: entity.id,
      itemName: entity.itemName,
      itemType: entity.itemType,
      materialLevel: entity.materialLevel,
      requestNote: entity.requestNote ?? undefined,
    };
  }
}
