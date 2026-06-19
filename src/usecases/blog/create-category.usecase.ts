import { Injectable } from '@nestjs/common';
import { CategoryQueryService } from '@src/modules/blog/queries/category.query.service';
import { CategoryService } from '@src/modules/blog/base/services/category.service';
import type { CategoryView, CreateCategoryInput } from '@src/modules/blog/blog.types';

@Injectable()
export class CreateCategoryUsecase {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly categoryQueryService: CategoryQueryService,
  ) {}

  async execute(input: CreateCategoryInput): Promise<CategoryView> {
    const saved = await this.categoryService.createCategory(input);
    return this.categoryQueryService.getCategoryOrThrow(saved.id);
  }
}
