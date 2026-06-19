import { Injectable } from '@nestjs/common';
import { CategoryService } from '@src/modules/blog/base/services/category.service';

@Injectable()
export class DeleteCategoryUsecase {
  constructor(private readonly categoryService: CategoryService) {}

  async execute(id: string): Promise<boolean> {
    return this.categoryService.deleteCategory(id);
  }
}