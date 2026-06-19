import { Injectable } from '@nestjs/common';
import { CategoryQueryService } from '@src/modules/blog/queries/category.query.service';
import { CategoryService } from '@src/modules/blog/base/services/category.service';
import type { CategoryView, UpdateCategoryInput } from '@src/modules/blog/blog.types';

@Injectable()
export class UpdateCategoryUsecase {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly categoryQueryService: CategoryQueryService,
  ) {}

  async execute(id: string, input: UpdateCategoryInput): Promise<CategoryView> {
    await this.categoryService.updateCategory(id, input);
    return this.categoryQueryService.getCategoryOrThrow(id);
  }
}