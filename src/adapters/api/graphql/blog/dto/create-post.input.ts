import { Field, InputType, Int } from '@nestjs/graphql';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { trimTextPure } from '@src/core/common/text/text.helper';

@InputType()
export class CreatePostInput {
  @Field()
  @Transform(({ value }: TransformFnParams) => trimTextPure(value))
  @IsString()
  @IsNotEmpty({ message: '标题不能为空' })
  title!: string;

  @Field({ nullable: true })
  @Transform(({ value }: TransformFnParams) => trimTextPure(value))
  @IsString()
  @IsOptional()
  slug?: string;

  @Field({ nullable: true })
  @Transform(({ value }: TransformFnParams) => trimTextPure(value))
  @IsString()
  @IsOptional()
  excerpt?: string;

  @Field()
  @IsString()
  @IsNotEmpty({ message: '内容不能为空' })
  content!: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  categoryId?: string;

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsOptional()
  tagIds?: string[];

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  isTop?: boolean;
}