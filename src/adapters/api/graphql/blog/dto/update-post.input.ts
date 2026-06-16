import { Field, InputType, Int } from '@nestjs/graphql';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsArray, IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { trimTextPure } from '@src/core/common/text/text.helper';
import { PostStatus } from '@app-types/models/blog.types';

@InputType()
export class UpdatePostInput {
  @Field({ nullable: true })
  @Transform(({ value }: TransformFnParams) => trimTextPure(value))
  @IsString()
  @IsOptional()
  title?: string;

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

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  content?: string;

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

  @Field({ nullable: true })
  @IsEnum(PostStatus)
  @IsOptional()
  status?: PostStatus;
}
