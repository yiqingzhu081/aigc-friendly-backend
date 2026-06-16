import { Field, ObjectType } from '@nestjs/graphql';
import {
  MagicItemCraftStatus,
  MagicItemQuality,
  MagicItemType,
} from '@src/modules/magic-workshop/magic-workshop.types';

@ObjectType()
export class MagicItemCraftTaskDto {
  @Field(() => String)
  id!: string;

  @Field(() => String)
  itemName!: string;

  @Field(() => String)
  itemType!: MagicItemType;

  @Field(() => String)
  status!: MagicItemCraftStatus;

  @Field(() => String, { nullable: true })
  qualityLevel?: MagicItemQuality;

  @Field(() => String, { nullable: true })
  resultDescription?: string;

  @Field(() => String, { nullable: true })
  craftLog?: string;

  @Field(() => String, { nullable: true })
  failureReason?: string;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;
}
