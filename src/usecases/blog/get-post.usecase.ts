import { Injectable } from '@nestjs/common';
import { BlogQueryService } from '@src/modules/blog/queries/blog.query.service';
import type { PostView } from '@src/modules/blog/blog.types';

@Injectable()
export class GetPostUsecase {
  constructor(private readonly blogQueryService: BlogQueryService) {}

  async execute(id: string): Promise<PostView | null> {
    return this.blogQueryService.getPostById({ id });
  }
}