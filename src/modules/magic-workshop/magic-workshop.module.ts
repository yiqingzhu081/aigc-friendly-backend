import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MagicItemCraftEntity } from './magic-item-craft.entity';
import { MagicWorkshopService } from './magic-workshop.service';
import { MagicWorkshopQueryService } from './queries/magic-workshop.query.service';

@Module({
  imports: [TypeOrmModule.forFeature([MagicItemCraftEntity])],
  providers: [MagicWorkshopService, MagicWorkshopQueryService],
  exports: [MagicWorkshopService, MagicWorkshopQueryService],
})
export class MagicWorkshopModule {}
