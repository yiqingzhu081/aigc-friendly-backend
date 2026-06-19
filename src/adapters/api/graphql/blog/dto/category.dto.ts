import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('Category')
export class CategoryDto {
  @Field(() => ID, { description: '分类ID' })
  id!: string;

  @Field({ description: '分类名称' })
  name!: string;

  @Field({ description: 'URL友好标识' })
  slug!: string;

  @Field({ nullable: true, description: '分类描述' })
  description!: string | null;

  @Field(() => ID, { nullable: true, description: '父分类ID' })
  parentId!: string | null;

  @Field({ nullable: true, description: '父分类名称' })
  parentName!: string | null;

  @Field({ description: '排序顺序' })
  sortOrder!: number;

  @Field({ description: '文章数量' })
  postCount!: number;

  @Field({ description: '创建时间' })
  createdAt!: Date;

  @Field({ description: '更新时间' })
  updatedAt!: Date;
}