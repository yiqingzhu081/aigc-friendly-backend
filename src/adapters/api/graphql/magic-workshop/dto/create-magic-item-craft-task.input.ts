import { Field, InputType } from '@nestjs/graphql';
import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateBy,
  ValidationOptions,
} from 'class-validator';
import { MagicItemType } from '@src/modules/magic-workshop/magic-workshop.types';
import { trimTextPure } from '@src/core/common/text/text.helper';

const isMagicItemTypeString = (value: unknown): boolean => {
  return typeof value === 'string' && Object.values(MagicItemType).includes(value as MagicItemType);
};

const magicItemTypeValidator = (validationOptions?: ValidationOptions) => {
  return ValidateBy(
    {
      name: 'isMagicItemType',
      constraints: [],
      validator: {
        validate(value: unknown): boolean {
          return isMagicItemTypeString(value);
        },
        defaultMessage(): string {
          return 'itemType must be one of: WEAPON, ARMOR, TOOL, TOY';
        },
      },
    },
    validationOptions,
  );
};

@InputType()
export class CreateMagicItemCraftTaskInput {
  @Field(() => String)
  @Transform(({ value }: TransformFnParams) => trimTextPure(value))
  @IsString()
  @IsNotEmpty()
  itemName!: string;

  @Field(() => String)
  @IsString()
  @magicItemTypeValidator()
  itemType!: MagicItemType;

  @Field(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  materialLevel!: number;

  @Field(() => String, { nullable: true })
  @Transform(({ value }: TransformFnParams) => trimTextPure(value))
  @IsOptional()
  @IsString()
  requestNote?: string;
}
