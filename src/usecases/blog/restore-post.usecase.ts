import { Injectable } from '@nestjs/common';
import { BlogQueryService } from '@src/modules/blog/queries/blog.query.service';
import { BlogService } from '@src/modules/blog/base/services/blog.service';
import type { PostView } from '@src/modules/blog/blog.types';

@Injectable()
export class RestorePostUsecase {
  constructor(
    private readonly blogService: BlogService,
    private readonly blogQueryService: BlogQueryService,
  ) {}

  async execute(id: string): Promise<PostView> {
    await this.blogService.restorePost({ id });
    return this.blogQueryService.getPostOrThrow({ id });
  }
}