import { Field, ObjectType } from '@nestjs/graphql';
import { PostStatus } from '@app-types/models/blog.types';

@ObjectType()
export class PostDto {
  @Field()
  id!: string;

  @Field()
  title!: string;

  @Field()
  slug!: string;

  @Field({ nullable: true })
  excerpt!: string | null;

  @Field()
  content!: string;

  @Field({ nullable: true })
  contentHtml!: string | null;

  @Field(() => String)
  status!: PostStatus;

  @Field()
  isTop!: boolean;

  @Field()
  viewCount!: number;

  @Field()
  likeCount!: number;

  @Field()
  commentCount!: number;

  @Field({ nullable: true })
  categoryId!: string | null;

  @Field({ nullable: true })
  categoryName!: string | null;

  @Field(() => [String])
  tagIds!: string[];

  @Field(() => [String])
  tagNames!: string[];

  @Field({ nullable: true })
  publishedAt!: Date | null;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
