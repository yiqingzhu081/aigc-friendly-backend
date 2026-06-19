import type { PersistenceTransactionContext } from '@app-types/common/transaction.types';
import { PostStatus } from '@app-types/models/blog.types';
import { DomainError } from '@core/common/errors/domain-error';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getTypeOrmEntityManager } from '@src/infrastructure/database/transaction/typeorm-persistence-transaction-context';
import { Repository } from 'typeorm';
import { BLOG_ERROR } from '../blog.errors';
import type { PaginatedPostsResult, PostQueryInput, PostView } from '../blog.types';
import { CategoryEntity } from '../base/entities/category.entity';
import { PostEntity } from '../base/entities/post.entity';
import { TagEntity } from '../base/entities/tag.entity';

@Injectable()
export class BlogQueryService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>,
  ) {}

  async getPostById(
    params: { id: string },
    transactionContext?: PersistenceTransactionContext,
  ): Promise<PostView | null> {
    const { id } = params;
    const postRepository = this.getPostRepository(transactionContext);

    const post = await postRepository.findOne({
      where: { id },
      relations: { category: true, tags: true },
    });

    if (!post) {
      return null;
    }

    return this.toPostView(post);
  }

  async getPostBySlug(
    params: { slug: string },
    transactionContext?: PersistenceTransactionContext,
  ): Promise<PostView | null> {
    const { slug } = params;
    const postRepository = this.getPostRepository(transactionContext);

    const post = await postRepository.findOne({
      where: { slug },
      relations: { category: true, tags: true },
    });

    if (!post) {
      return null;
    }

    return this.toPostView(post);
  }

  async queryPosts(
    params: { input: PostQueryInput },
    transactionContext?: PersistenceTransactionContext,
  ): Promise<PaginatedPostsResult> {
    const { input } = params;
    const postRepository = this.getPostRepository(transactionContext);

    const page = input.page || 1;
    const pageSize = input.pageSize || 10;
    const skip = (page - 1) * pageSize;

    const queryBuilder = postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.category', 'category')
      .leftJoinAndSelect('post.tags', 'tags')
      .where('post.deletedAt IS NULL');

    if (input.keyword) {
      queryBuilder.andWhere(
        '(post.title LIKE :keyword OR post.excerpt LIKE :keyword OR post.content LIKE :keyword)',
        { keyword: `%${input.keyword}%` },
      );
    }

    if (input.categoryId) {
      queryBuilder.andWhere('category.id = :categoryId', { categoryId: input.categoryId });
    }

    if (input.tagId) {
      queryBuilder.andWhere('tags.id = :tagId', { tagId: input.tagId });
    }

    if (input.status) {
      queryBuilder.andWhere('post.status = :status', { status: input.status });
    }

    if (input.isTop !== undefined) {
      queryBuilder.andWhere('post.isTop = :isTop', { isTop: input.isTop });
    }

    queryBuilder.orderBy('post.isTop', 'DESC');
    queryBuilder.addOrderBy(
      input.status === PostStatus.DRAFT ? 'post.updatedAt' : 'post.publishedAt',
      'DESC',
    );

    const [posts, total] = await queryBuilder.skip(skip).take(pageSize).getManyAndCount();

    const items = posts.map((post) => this.toPostView(post));

    return {
      items,
      total,
      page,
      pageSize,
    };
  }

  async getPostOrThrow(
    params: { id: string },
    transactionContext?: PersistenceTransactionContext,
  ): Promise<PostView> {
    const post = await this.getPostById(params, transactionContext);
    if (!post) {
      throw new DomainError(BLOG_ERROR.POST_NOT_FOUND, '文章不存在');
    }
    return post;
  }

  async queryDeletedPosts(
    params: { input: PostQueryInput },
    transactionContext?: PersistenceTransactionContext,
  ): Promise<PaginatedPostsResult> {
    const { input } = params;
    const postRepository = this.getPostRepository(transactionContext);

    const page = input.page || 1;
    const pageSize = input.pageSize || 10;
    const skip = (page - 1) * pageSize;

    const queryBuilder = postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.category', 'category')
      .leftJoinAndSelect('post.tags', 'tags')
      .where('post.deletedAt IS NOT NULL')
      .withDeleted();

    if (input.keyword) {
      queryBuilder.andWhere(
        '(post.title LIKE :keyword OR post.excerpt LIKE :keyword OR post.content LIKE :keyword)',
        { keyword: `%${input.keyword}%` },
      );
    }

    queryBuilder.orderBy('post.deletedAt', 'DESC');

    const [posts, total] = await queryBuilder.skip(skip).take(pageSize).getManyAndCount();

    const items = posts.map((post) => this.toPostView(post));

    return {
      items,
      total,
      page,
      pageSize,
    };
  }

  private toPostView(post: PostEntity): PostView {
    return {
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      contentHtml: post.contentHtml,
      status: post.status,
      isTop: post.isTop,
      viewCount: post.viewCount,
      likeCount: post.likeCount,
      commentCount: post.commentCount,
      categoryId: post.category?.id || null,
      categoryName: post.category?.name || null,
      tagIds: post.tags?.map((tag) => tag.id) || [],
      tagNames: post.tags?.map((tag) => tag.name) || [],
      publishedAt: post.publishedAt,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }

  private getPostRepository(
    transactionContext?: PersistenceTransactionContext,
  ): Repository<PostEntity> {
    return transactionContext
      ? getTypeOrmEntityManager(transactionContext).getRepository(PostEntity)
      : this.postRepository;
  }

  private getCategoryRepository(
    transactionContext?: PersistenceTransactionContext,
  ): Repository<CategoryEntity> {
    return transactionContext
      ? getTypeOrmEntityManager(transactionContext).getRepository(CategoryEntity)
      : this.categoryRepository;
  }

  private getTagRepository(
    transactionContext?: PersistenceTransactionContext,
  ): Repository<TagEntity> {
    return transactionContext
      ? getTypeOrmEntityManager(transactionContext).getRepository(TagEntity)
      : this.tagRepository;
  }
}
