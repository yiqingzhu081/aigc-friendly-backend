import { Field, InputType, Int } from '@nestjs/graphql';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { trimTextPure } from '@src/core/common/text/text.helper';
import { PostStatus } from '@app-types/models/blog.types';

@InputType()
export class PostQueryInput {
  @Field({ nullable: true })
  @Transform(({ value }: TransformFnParams) => trimTextPure(value))
  @IsString()
  @IsOptional()
  keyword?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  categoryId?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  tagId?: string;

  @Field({ nullable: true })
  @IsEnum(PostStatus)
  @IsOptional()
  status?: PostStatus;

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  isTop?: boolean;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  pageSize?: number;
}
