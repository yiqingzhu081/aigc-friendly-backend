import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MagicItemCraftEntity } from '../magic-item-craft.entity';
import type { MagicItemCraftDetail } from '../magic-workshop.types';

@Injectable()
export class MagicWorkshopQueryService {
  constructor(
    @InjectRepository(MagicItemCraftEntity)
    private readonly craftRepository: Repository<MagicItemCraftEntity>,
  ) {}

  async findById(id: string): Promise<MagicItemCraftDetail | null> {
    const entity = await this.craftRepository.findOneBy({ id });
    if (!entity) {
      return null;
    }
    return this.toDetail(entity);
  }

  async findAll(): Promise<MagicItemCraftDetail[]> {
    const entities = await this.craftRepository.find({
      order: { createdAt: 'DESC' },
    });
    return entities.map((entity) => this.toDetail(entity));
  }

  private toDetail(entity: MagicItemCraftEntity): MagicItemCraftDetail {
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
}
