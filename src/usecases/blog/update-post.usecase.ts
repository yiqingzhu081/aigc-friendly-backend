import { Injectable } from '@nestjs/common';
import { BlogService } from '@src/modules/blog/base/services/blog.service';
import { BlogQueryService } from '@src/modules/blog/queries/blog.query.service';
import type { PostView, UpdatePostInput } from '@src/modules/blog/blog.types';

@Injectable()
export class UpdatePostUsecase {
  constructor(
    private readonly blogService: BlogService,
    private readonly blogQueryService: BlogQueryService,
  ) {}

  async execute(params: { id: string; input: UpdatePostInput }): Promise<PostView> {
    const { id, input } = params;
    const snapshot = await this.blogService.updatePost({ id, input });
    return this.blogQueryService.getPostOrThrow({ id: snapshot.id });
  }
}