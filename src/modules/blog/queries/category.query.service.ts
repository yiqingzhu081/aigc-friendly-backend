import { DomainError } from '@core/common/errors/domain-error';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BLOG_ERROR } from '../blog.errors';
import type { CategoryTreeNode, CategoryView } from '../blog.types';
import { CategoryEntity } from '../base/entities/category.entity';
import { PostEntity } from '../base/entities/post.entity';

@Injectable()
export class CategoryQueryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
  ) {}

  async getAllCategories(): Promise<CategoryView[]> {
    const categories = await this.categoryRepository.find({
      relations: { parent: true },
      order: { sortOrder: 'ASC', createdAt: 'DESC' },
    });

    const postCountMap = await this.getPostCountMap();

    return categories.map((category) => this.toCategoryView(category, postCountMap));
  }

  async getCategoryById(id: string): Promise<CategoryView | null> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: { parent: true },
    });

    if (!category) return null;

    const postCountMap = await this.getPostCountMap();
    return this.toCategoryView(category, postCountMap);
  }

  async getCategoryOrThrow(id: string): Promise<CategoryView> {
    const category = await this.getCategoryById(id);
    if (!category) {
      throw new DomainError(BLOG_ERROR.CATEGORY_NOT_FOUND, '分类不存在');
    }
    return category;
  }

  async getCategoryTree(): Promise<CategoryTreeNode[]> {
    const categories = await this.categoryRepository.find({
      order: { sortOrder: 'ASC', createdAt: 'DESC' },
    });

    const postCountMap = await this.getPostCountMap();

    const categoryMap = new Map<string, CategoryTreeNode>();
    const rootNodes: CategoryTreeNode[] = [];

    for (const category of categories) {
      const node: CategoryTreeNode = {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        sortOrder: category.sortOrder,
        postCount: postCountMap.get(category.id) || 0,
        children: [],
      };
      categoryMap.set(category.id, node);
    }

    for (const category of categories) {
      const node = categoryMap.get(category.id)!;
      if (category.parentId && categoryMap.has(category.parentId)) {
        categoryMap.get(category.parentId)!.children.push(node);
      } else {
        rootNodes.push(node);
      }
    }

    return rootNodes;
  }

  private async getPostCountMap(): Promise<Map<string, number>> {
    const result = await this.postRepository
      .createQueryBuilder('post')
      .select('post.categoryId', 'categoryId')
      .addSelect('COUNT(post.id)', 'count')
      .where('post.deletedAt IS NULL')
      .groupBy('post.categoryId')
      .getRawMany();

    const map = new Map<string, number>();
    for (const row of result) {
      if (row.categoryId) {
        map.set(row.categoryId, parseInt(row.count, 10));
      }
    }
    return map;
  }

  private toCategoryView(category: CategoryEntity, postCountMap: Map<string, number>): CategoryView {
    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      parentId: category.parentId,
      parentName: category.parent?.name || null,
      sortOrder: category.sortOrder,
      postCount: postCountMap.get(category.id) || 0,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }
}