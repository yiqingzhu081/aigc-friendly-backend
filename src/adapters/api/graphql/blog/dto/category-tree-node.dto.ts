import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('CategoryTreeNode')
export class CategoryTreeNodeDto {
  @Field(() => ID, { description: '分类ID' })
  id!: string;

  @Field({ description: '分类名称' })
  name!: string;

  @Field({ description: 'URL友好标识' })
  slug!: string;

  @Field({ nullable: true, description: '分类描述' })
  description!: string | null;

  @Field({ description: '排序顺序' })
  sortOrder!: number;

  @Field({ description: '文章数量' })
  postCount!: number;

  @Field(() => [CategoryTreeNodeDto], { description: '子分类' })
  children!: CategoryTreeNodeDto[];
}