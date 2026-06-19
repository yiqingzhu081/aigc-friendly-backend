import { Injectable } from '@nestjs/common';
import { CategoryQueryService } from '@src/modules/blog/queries/category.query.service';
import type { CategoryTreeNode, CategoryView } from '@src/modules/blog/blog.types';

@Injectable()
export class GetCategoryUsecase {
  constructor(private readonly categoryQueryService: CategoryQueryService) {}

  async execute(id: string): Promise<CategoryView> {
    return this.categoryQueryService.getCategoryOrThrow(id);
  }
}