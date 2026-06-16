import { Module } from '@nestjs/common';
import { BullMqModule } from '@src/infrastructure/bullmq/bullmq.module';
import { MagicWorkshopModule } from '@src/modules/magic-workshop/magic-workshop.module';
import { CreateMagicItemCraftTaskUsecase } from './create-magic-item-craft-task.usecase';
import { GetMagicItemCraftTaskUsecase } from './get-magic-item-craft-task.usecase';
import { ListMagicItemCraftTasksUsecase } from './list-magic-item-craft-tasks.usecase';

@Module({
  imports: [MagicWorkshopModule, BullMqModule],
  providers: [
    CreateMagicItemCraftTaskUsecase,
    GetMagicItemCraftTaskUsecase,
    ListMagicItemCraftTasksUsecase,
  ],
  exports: [
    CreateMagicItemCraftTaskUsecase,
    GetMagicItemCraftTaskUsecase,
    ListMagicItemCraftTasksUsecase,
  ],
})
export class MagicWorkshopUsecasesModule {}
