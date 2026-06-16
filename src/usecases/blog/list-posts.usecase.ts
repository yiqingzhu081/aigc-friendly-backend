import { Injectable } from '@nestjs/common';
import { BlogQueryService } from '@src/modules/blog/queries/blog.query.service';
import type { PaginatedPostsResult, PostQueryInput } from '@src/modules/blog/blog.types';

@Injectable()
export class ListPostsUsecase {
  constructor(private readonly blogQueryService: BlogQueryService) {}

  async execute(input: PostQueryInput): Promise<PaginatedPostsResult> {
    return this.blogQueryService.queryPosts({ input });
  }
}