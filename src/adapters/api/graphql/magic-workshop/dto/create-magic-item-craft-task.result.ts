import { Field, ObjectType } from '@nestjs/graphql';
import { MagicItemCraftStatus } from '@src/modules/magic-workshop/magic-workshop.types';

@ObjectType()
export class CreateMagicItemCraftTaskResult {
  @Field(() => String)
  id!: string;

  @Field(() => String)
  status!: MagicItemCraftStatus;

  @Field(() => String)
  itemName!: string;

  @Field(() => Date)
  createdAt!: Date;
}
