import type { PersistenceTransactionContext } from '@app-types/common/transaction.types';
import { DomainError } from '@core/common/errors/domain-error';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getTypeOrmEntityManager } from '@src/infrastructure/database/transaction/typeorm-persistence-transaction-context';
import { Repository, In } from 'typeorm';
import { BLOG_ERROR } from '../../blog.errors';
import type { CreatePostInput, PostSnapshot, UpdatePostInput } from '../../blog.types';
import { PostStatus } from '@app-types/models/blog.types';
import { CategoryEntity } from '../entities/category.entity';
import { PostEntity } from '../entities/post.entity';
import { TagEntity } from '../entities/tag.entity';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>,
  ) {}

  async createPost(
    params: { input: CreatePostInput },
    transactionContext?: PersistenceTransactionContext,
  ): Promise<PostSnapshot> {
    const { input } = params;
    const postRepository = this.getPostRepository(transactionContext);

    const categoryEntity = input.categoryId
      ? await this.findCategoryById(input.categoryId, transactionContext)
      : null;

    const tags =
      input.tagIds && input.tagIds.length > 0
        ? await this.findTagsByIds(input.tagIds, transactionContext)
        : [];

    const slug = input.slug || this.generateSlug(input.title);

    const existingSlug = await postRepository.findOne({ where: { slug } });
    if (existingSlug) {
      throw new DomainError(BLOG_ERROR.SLUG_EXISTS, '文章链接已存在');
    }

    const post = postRepository.create({
      title: input.title,
      slug,
      excerpt: input.excerpt || null,
      content: input.content,
      contentHtml: input.content,
      status: PostStatus.DRAFT,
      isTop: input.isTop || false,
      viewCount: 0,
      likeCount: 0,
      commentCount: 0,
      category: categoryEntity ?? undefined,
      tags,
    });

    const saved = await postRepository.save(post);
    return this.toPostSnapshot(saved);
  }

  async updatePost(
    params: { id: string; input: UpdatePostInput },
    transactionContext?: PersistenceTransactionContext,
  ): Promise<PostSnapshot> {
    const { id, input } = params;
    const postRepository = this.getPostRepository(transactionContext);

    const post = await postRepository.findOne({
      where: { id },
      relations: { category: true, tags: true },
    });

    if (!post) {
      throw new DomainError(BLOG_ERROR.POST_NOT_FOUND, '文章不存在');
    }

    if (input.title !== undefined) {
      post.title = input.title;
    }

    if (input.slug !== undefined) {
      const slug = input.slug || this.generateSlug(post.title);
      const existingSlug = await postRepository.findOne({ where: { slug } });
      if (existingSlug && existingSlug.id !== id) {
        throw new DomainError(BLOG_ERROR.SLUG_EXISTS, '文章链接已存在');
      }
      post.slug = slug;
    }

    if (input.excerpt !== undefined) {
      post.excerpt = input.excerpt || null;
    }

    if (input.content !== undefined) {
      post.content = input.content;
      post.contentHtml = input.content;
    }

    if (input.categoryId !== undefined) {
      const categoryEntity = input.categoryId
        ? await this.findCategoryById(input.categoryId, transactionContext)
        : null;
      post.category = categoryEntity ?? undefined;
    }

    if (input.tagIds !== undefined) {
      post.tags =
        input.tagIds && input.tagIds.length > 0
          ? await this.findTagsByIds(input.tagIds, transactionContext)
          : [];
    }

    if (input.isTop !== undefined) {
      post.isTop = input.isTop;
    }

    if (input.status !== undefined) {
      post.status = input.status;
      if (input.status === PostStatus.PUBLISHED && !post.publishedAt) {
        post.publishedAt = new Date();
      }
    }

    const saved = await postRepository.save(post);
    return this.toPostSnapshot(saved);
  }

  async deletePost(
    params: { id: string },
    transactionContext?: PersistenceTransactionContext,
  ): Promise<boolean> {
    const { id } = params;
    const postRepository = this.getPostRepository(transactionContext);

    const post = await postRepository.findOne({ where: { id } });
    if (!post) {
      throw new DomainError(BLOG_ERROR.POST_NOT_FOUND, '文章不存在');
    }

    await postRepository.softDelete(id);
    return true;
  }

  async restorePost(
    params: { id: string },
    transactionContext?: PersistenceTransactionContext,
  ): Promise<PostSnapshot> {
    const { id } = params;
    const postRepository = this.getPostRepository(transactionContext);

    const post = await postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.category', 'category')
      .leftJoinAndSelect('post.tags', 'tags')
      .where('post.id = :id', { id })
      .withDeleted()
      .getOne();

    if (!post) {
      throw new DomainError(BLOG_ERROR.POST_NOT_FOUND, '文章不存在');
    }

    if (!post.deletedAt) {
      throw new DomainError(BLOG_ERROR.POST_NOT_DELETED, '文章未被删除');
    }

    post.deletedAt = null;
    const saved = await postRepository.save(post);
    return this.toPostSnapshot(saved);
  }

  async togglePostTop(
    params: { id: string },
    transactionContext?: PersistenceTransactionContext,
  ): Promise<PostSnapshot> {
    const { id } = params;
    const postRepository = this.getPostRepository(transactionContext);

    const post = await postRepository.findOne({
      where: { id },
      relations: { category: true, tags: true },
    });

    if (!post) {
      throw new DomainError(BLOG_ERROR.POST_NOT_FOUND, '文章不存在');
    }

    post.isTop = !post.isTop;
    const saved = await postRepository.save(post);
    return this.toPostSnapshot(saved);
  }

  async publishPost(
    params: { id: string },
    transactionContext?: PersistenceTransactionContext,
  ): Promise<PostSnapshot> {
    const { id } = params;
    const postRepository = this.getPostRepository(transactionContext);

    const post = await postRepository.findOne({
      where: { id },
      relations: { category: true, tags: true },
    });

    if (!post) {
      throw new DomainError(BLOG_ERROR.POST_NOT_FOUND, '文章不存在');
    }

    if (post.status === PostStatus.PUBLISHED) {
      throw new DomainError(BLOG_ERROR.POST_ALREADY_PUBLISHED, '文章已发布');
    }

    post.status = PostStatus.PUBLISHED;
    if (!post.publishedAt) {
      post.publishedAt = new Date();
    }

    const saved = await postRepository.save(post);
    return this.toPostSnapshot(saved);
  }

  async unpublishPost(
    params: { id: string },
    transactionContext?: PersistenceTransactionContext,
  ): Promise<PostSnapshot> {
    const { id } = params;
    const postRepository = this.getPostRepository(transactionContext);

    const post = await postRepository.findOne({
      where: { id },
      relations: { category: true, tags: true },
    });

    if (!post) {
      throw new DomainError(BLOG_ERROR.POST_NOT_FOUND, '文章不存在');
    }

    if (post.status !== PostStatus.PUBLISHED) {
      throw new DomainError(BLOG_ERROR.POST_NOT_PUBLISHED, '文章未发布');
    }

    post.status = PostStatus.ARCHIVED;
    const saved = await postRepository.save(post);
    return this.toPostSnapshot(saved);
  }

  async incrementViewCount(
    params: { id: string },
    transactionContext?: PersistenceTransactionContext,
  ): Promise<void> {
    const { id } = params;
    const postRepository = this.getPostRepository(transactionContext);

    await postRepository.increment({ id }, 'viewCount', 1);
  }

  async incrementLikeCount(
    params: { id: string },
    transactionContext?: PersistenceTransactionContext,
  ): Promise<void> {
    const { id } = params;
    const postRepository = this.getPostRepository(transactionContext);

    await postRepository.increment({ id }, 'likeCount', 1);
  }

  async incrementCommentCount(
    params: { id: string },
    transactionContext?: PersistenceTransactionContext,
  ): Promise<void> {
    const { id } = params;
    const postRepository = this.getPostRepository(transactionContext);

    await postRepository.increment({ id }, 'commentCount', 1);
  }

  async decrementCommentCount(
    params: { id: string },
    transactionContext?: PersistenceTransactionContext,
  ): Promise<void> {
    const { id } = params;
    const postRepository = this.getPostRepository(transactionContext);

    await postRepository.decrement({ id }, 'commentCount', 1);
  }

  private async findCategoryById(
    id: string,
    transactionContext?: PersistenceTransactionContext,
  ): Promise<CategoryEntity | null> {
    const repository = this.getCategoryRepository(transactionContext);
    return await repository.findOne({ where: { id } });
  }

  private async findTagsByIds(
    ids: string[],
    transactionContext?: PersistenceTransactionContext,
  ): Promise<TagEntity[]> {
    const repository = this.getTagRepository(transactionContext);
    return await repository.findBy({ id: In(ids) });
  }

  private generateSlug(title: string): string {
    return (
      title
        .toLowerCase()
        .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
        .replace(/^-|-$/g, '') || 'post'
    );
  }

  private toPostSnapshot(post: PostEntity): PostSnapshot {
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
