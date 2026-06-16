import { ValidateInput } from '@adapters/api/graphql/common/validate-input.decorator';
import { Args, Field, InputType, Mutation, ObjectType, Query, Resolver } from '@nestjs/graphql';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { trimTextPure } from '@src/core/common/text/text.helper';
import { CreateMagicItemCraftTaskUsecase } from '@src/usecases/magic-workshop/create-magic-item-craft-task.usecase';
import { GetMagicItemCraftTaskUsecase } from '@src/usecases/magic-workshop/get-magic-item-craft-task.usecase';
import { ListMagicItemCraftTasksUsecase } from '@src/usecases/magic-workshop/list-magic-item-craft-tasks.usecase';
import { CreateMagicItemCraftTaskInput } from './dto/create-magic-item-craft-task.input';
import { CreateMagicItemCraftTaskResult } from './dto/create-magic-item-craft-task.result';
import { MagicItemCraftTaskDto } from './dto/magic-item-craft-task.dto';

@InputType()
class GetMagicItemCraftTaskInput {
  @Field(() => String)
  @Transform(({ value }: TransformFnParams) => trimTextPure(value))
  @IsString()
  @IsNotEmpty()
  id!: string;
}

@ObjectType()
class ListMagicItemCraftTasksResult {
  @Field(() => [MagicItemCraftTaskDto])
  items!: MagicItemCraftTaskDto[];
}

@Resolver()
export class MagicWorkshopResolver {
  constructor(
    private readonly createCraftTaskUsecase: CreateMagicItemCraftTaskUsecase,
    private readonly getCraftTaskUsecase: GetMagicItemCraftTaskUsecase,
    private readonly listCraftTasksUsecase: ListMagicItemCraftTasksUsecase,
  ) {}

  @Mutation(() => CreateMagicItemCraftTaskResult, {
    description: '创建魔法道具制作任务',
  })
  @ValidateInput()
  async createMagicItemCraftTask(
    @Args('input') input: CreateMagicItemCraftTaskInput,
  ): Promise<CreateMagicItemCraftTaskResult> {
    const result = await this.createCraftTaskUsecase.execute({
      itemName: input.itemName,
      itemType: input.itemType,
      materialLevel: input.materialLevel,
      requestNote: input.requestNote,
    });
    return {
      id: result.id,
      status: result.status,
      itemName: result.itemName,
      createdAt: result.createdAt,
    };
  }

  @Query(() => MagicItemCraftTaskDto, {
    nullable: true,
    description: '查询单个魔法道具制作任务',
  })
  @ValidateInput()
  async magicItemCraftTask(
    @Args('input') input: GetMagicItemCraftTaskInput,
  ): Promise<MagicItemCraftTaskDto | null> {
    const result = await this.getCraftTaskUsecase.execute(input.id);
    if (!result) {
      return null;
    }
    return {
      id: result.id,
      itemName: result.itemName,
      itemType: result.itemType,
      status: result.status,
      qualityLevel: result.qualityLevel,
      resultDescription: result.resultDescription,
      craftLog: result.craftLog,
      failureReason: result.failureReason,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  @Query(() => ListMagicItemCraftTasksResult, {
    description: '查询所有魔法道具制作任务',
  })
  async magicItemCraftTasks(): Promise<ListMagicItemCraftTasksResult> {
    const items = await this.listCraftTasksUsecase.execute();
    return {
      items: items.map((item) => ({
        id: item.id,
        itemName: item.itemName,
        itemType: item.itemType,
        status: item.status,
        qualityLevel: item.qualityLevel,
        resultDescription: item.resultDescription,
        craftLog: item.craftLog,
        failureReason: item.failureReason,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      })),
    };
  }
}
