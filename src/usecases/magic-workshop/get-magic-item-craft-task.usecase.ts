import { Injectable } from '@nestjs/common';
import { MagicWorkshopQueryService } from '@src/modules/magic-workshop/queries/magic-workshop.query.service';
import type { MagicItemCraftDetail } from '@src/modules/magic-workshop/magic-workshop.types';

@Injectable()
export class GetMagicItemCraftTaskUsecase {
  constructor(private readonly queryService: MagicWorkshopQueryService) {}

  async execute(id: string): Promise<MagicItemCraftDetail | null> {
    return await this.queryService.findById(id);
  }
}
