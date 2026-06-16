import { Injectable } from '@nestjs/common';
import { BlogService } from '@src/modules/blog/base/services/blog.service';
import { BlogQueryService } from '@src/modules/blog/queries/blog.query.service';
import type { CreatePostInput, PostView } from '@src/modules/blog/blog.types';

@Injectable()
export class CreatePostUsecase {
  constructor(
    private readonly blogService: BlogService,
    private readonly blogQueryService: BlogQueryService,
  ) {}

  async execute(input: CreatePostInput): Promise<PostView> {
    const snapshot = await this.blogService.createPost({ input });
    return this.blogQueryService.getPostOrThrow({ id: snapshot.id });
  }
}