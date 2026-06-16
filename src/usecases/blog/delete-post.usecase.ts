import { Injectable } from '@nestjs/common';
import { BlogService } from '@src/modules/blog/base/services/blog.service';

@Injectable()
export class DeletePostUsecase {
  constructor(private readonly blogService: BlogService) {}

  async execute(id: string): Promise<boolean> {
    return this.blogService.deletePost({ id });
  }
}