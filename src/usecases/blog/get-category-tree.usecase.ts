import { Injectable } from '@nestjs/common';
import { CategoryQueryService } from '@src/modules/blog/queries/category.query.service';
import type { CategoryTreeNode } from '@src/modules/blog/blog.types';

@Injectable()
export class GetCategoryTreeUsecase {
  constructor(private readonly categoryQueryService: CategoryQueryService) {}

  async execute(): Promise<CategoryTreeNode[]> {
    return this.categoryQueryService.getCategoryTree();
  }
}