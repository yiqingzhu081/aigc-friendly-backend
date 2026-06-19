import { DomainError } from '@core/common/errors/domain-error';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BLOG_ERROR } from '../../blog.errors';
import type { CategoryView, CreateCategoryInput, UpdateCategoryInput } from '../../blog.types';
import { CategoryEntity } from '../entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async createCategory(input: CreateCategoryInput): Promise<CategoryEntity> {
    const slug = input.slug || this.generateSlug(input.name);

    const existingSlug = await this.categoryRepository.findOne({ where: { slug } });
    if (existingSlug) {
      throw new DomainError(BLOG_ERROR.SLUG_EXISTS, '分类链接已存在');
    }

    if (input.parentId) {
      const parent = await this.categoryRepository.findOne({ where: { id: input.parentId } });
      if (!parent) {
        throw new DomainError(BLOG_ERROR.CATEGORY_NOT_FOUND, '父分类不存在');
      }
    }

    const category = this.categoryRepository.create({
      name: input.name,
      slug,
      description: input.description || null,
      parentId: input.parentId || null,
      sortOrder: input.sortOrder || 0,
    });

    return this.categoryRepository.save(category);
  }

  async updateCategory(id: string, input: UpdateCategoryInput): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new DomainError(BLOG_ERROR.CATEGORY_NOT_FOUND, '分类不存在');
    }

    if (input.slug && input.slug !== category.slug) {
      const existingSlug = await this.categoryRepository.findOne({ where: { slug: input.slug } });
      if (existingSlug) {
        throw new DomainError(BLOG_ERROR.SLUG_EXISTS, '分类链接已存在');
      }
      category.slug = input.slug;
    }

    if (input.name !== undefined) category.name = input.name;
    if (input.description !== undefined) category.description = input.description || null;
    if (input.parentId !== undefined) {
      if (input.parentId === id) {
        throw new DomainError(BLOG_ERROR.CATEGORY_NOT_FOUND, '不能将分类设置为自身的子分类');
      }
      if (input.parentId) {
        const parent = await this.categoryRepository.findOne({ where: { id: input.parentId } });
        if (!parent) {
          throw new DomainError(BLOG_ERROR.CATEGORY_NOT_FOUND, '父分类不存在');
        }
      }
      category.parentId = input.parentId;
    }
    if (input.sortOrder !== undefined) category.sortOrder = input.sortOrder;

    return this.categoryRepository.save(category);
  }

  async deleteCategory(id: string): Promise<boolean> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new DomainError(BLOG_ERROR.CATEGORY_NOT_FOUND, '分类不存在');
    }

    const hasChildren = await this.categoryRepository.exists({ where: { parentId: id } });
    if (hasChildren) {
      throw new DomainError(BLOG_ERROR.CATEGORY_NOT_FOUND, '该分类下有子分类，无法删除');
    }

    await this.categoryRepository.delete(id);
    return true;
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
      .replace(/^-|-$/g, '');
  }
}
