import { Field, ID, InputType } from '@nestjs/graphql';
import { IsOptional, IsString, MaxLength } from 'class-validator';

@InputType()
export class CreateCategoryInput {
  @Field({ description: '分类名称' })
  @IsString()
  @MaxLength(50)
  name!: string;

  @Field({ nullable: true, description: 'URL友好标识' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  slug?: string;

  @Field({ nullable: true, description: '分类描述' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  description?: string;

  @Field(() => ID, { nullable: true, description: '父分类ID' })
  @IsOptional()
  parentId?: string | null;

  @Field({ nullable: true, description: '排序顺序' })
  @IsOptional()
  sortOrder?: number;
}