import { Field, ObjectType, Int } from '@nestjs/graphql';
import { PostDto } from './post.dto';

@ObjectType()
export class PostConnection {
  @Field(() => [PostDto])
  items!: PostDto[];

  @Field(() => Int)
  total!: number;

  @Field(() => Int)
  page!: number;

  @Field(() => Int)
  pageSize!: number;
}