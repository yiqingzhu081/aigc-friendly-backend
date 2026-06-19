import { ValidateInput } from '@adapters/api/graphql/common/validate-input.decorator';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreatePostUsecase } from '@src/usecases/blog/create-post.usecase';
import { DeletePostUsecase } from '@src/usecases/blog/delete-post.usecase';
import { GetPostUsecase } from '@src/usecases/blog/get-post.usecase';
import { ListPostsUsecase } from '@src/usecases/blog/list-posts.usecase';
import { UpdatePostUsecase } from '@src/usecases/blog/update-post.usecase';
import { TogglePostTopUsecase } from '@src/usecases/blog/toggle-post-top.usecase';
import { PublishPostUsecase } from '@src/usecases/blog/publish-post.usecase';
import { UnpublishPostUsecase } from '@src/usecases/blog/unpublish-post.usecase';
import { RestorePostUsecase } from '@src/usecases/blog/restore-post.usecase';
import { IncrementPostViewUsecase } from '@src/usecases/blog/increment-post-view.usecase';
import { ListDeletedPostsUsecase } from '@src/usecases/blog/list-deleted-posts.usecase';
import type { PostView } from '@src/modules/blog/blog.types';
import { CreatePostInput } from './dto/create-post.input';
import { PostConnection } from './dto/post-connection.dto';
import { PostDto } from './dto/post.dto';
import { PostQueryInput } from './dto/post-query.input';
import { UpdatePostInput } from './dto/update-post.input';

@Resolver()
export class BlogResolver {
  constructor(
    private readonly createPostUsecase: CreatePostUsecase,
    private readonly updatePostUsecase: UpdatePostUsecase,
    private readonly deletePostUsecase: DeletePostUsecase,
    private readonly getPostUsecase: GetPostUsecase,
    private readonly listPostsUsecase: ListPostsUsecase,
    private readonly togglePostTopUsecase: TogglePostTopUsecase,
    private readonly publishPostUsecase: PublishPostUsecase,
    private readonly unpublishPostUsecase: UnpublishPostUsecase,
    private readonly restorePostUsecase: RestorePostUsecase,
    private readonly incrementPostViewUsecase: IncrementPostViewUsecase,
    private readonly listDeletedPostsUsecase: ListDeletedPostsUsecase,
  ) {}

  @Query(() => PostConnection, { description: '文章列表查询（支持分页）' })
  @ValidateInput()
  async posts(@Args('input', { nullable: true }) input?: PostQueryInput): Promise<PostConnection> {
    const result = await this.listPostsUsecase.execute(input || {});
    return {
      items: result.items.map((item) => ({
        id: item.id,
        title: item.title,
        slug: item.slug,
        excerpt: item.excerpt,
        content: item.content,
        contentHtml: item.contentHtml,
        status: item.status,
        isTop: item.isTop,
        viewCount: item.viewCount,
        likeCount: item.likeCount,
        commentCount: item.commentCount,
        categoryId: item.categoryId,
        categoryName: item.categoryName,
        tagIds: item.tagIds,
        tagNames: item.tagNames,
        publishedAt: item.publishedAt,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      })),
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
    };
  }

  @Query(() => PostDto, { nullable: true, description: '查询单篇文章' })
  @ValidateInput()
  async post(@Args('id') id: string): Promise<PostDto | null> {
    const result = await this.getPostUsecase.execute(id);
    if (!result) {
      return null;
    }
    return {
      id: result.id,
      title: result.title,
      slug: result.slug,
      excerpt: result.excerpt,
      content: result.content,
      contentHtml: result.contentHtml,
      status: result.status,
      isTop: result.isTop,
      viewCount: result.viewCount,
      likeCount: result.likeCount,
      commentCount: result.commentCount,
      categoryId: result.categoryId,
      categoryName: result.categoryName,
      tagIds: result.tagIds,
      tagNames: result.tagNames,
      publishedAt: result.publishedAt,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  @Mutation(() => PostDto, { description: '创建文章' })
  @ValidateInput()
  async createPost(@Args('input') input: CreatePostInput): Promise<PostDto> {
    const result = await this.createPostUsecase.execute({
      title: input.title,
      slug: input.slug,
      excerpt: input.excerpt,
      content: input.content,
      categoryId: input.categoryId || null,
      tagIds: input.tagIds || [],
      isTop: input.isTop || false,
    });
    return {
      id: result.id,
      title: result.title,
      slug: result.slug,
      excerpt: result.excerpt,
      content: result.content,
      contentHtml: result.contentHtml,
      status: result.status,
      isTop: result.isTop,
      viewCount: result.viewCount,
      likeCount: result.likeCount,
      commentCount: result.commentCount,
      categoryId: result.categoryId,
      categoryName: result.categoryName,
      tagIds: result.tagIds,
      tagNames: result.tagNames,
      publishedAt: result.publishedAt,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  @Mutation(() => PostDto, { description: '更新文章' })
  @ValidateInput()
  async updatePost(
    @Args('id') id: string,
    @Args('input') input: UpdatePostInput,
  ): Promise<PostDto> {
    const result = await this.updatePostUsecase.execute({
      id,
      input: {
        title: input.title,
        slug: input.slug,
        excerpt: input.excerpt,
        content: input.content,
        categoryId: input.categoryId ?? undefined,
        tagIds: input.tagIds ?? undefined,
        isTop: input.isTop,
        status: input.status,
      },
    });
    return {
      id: result.id,
      title: result.title,
      slug: result.slug,
      excerpt: result.excerpt,
      content: result.content,
      contentHtml: result.contentHtml,
      status: result.status,
      isTop: result.isTop,
      viewCount: result.viewCount,
      likeCount: result.likeCount,
      commentCount: result.commentCount,
      categoryId: result.categoryId,
      categoryName: result.categoryName,
      tagIds: result.tagIds,
      tagNames: result.tagNames,
      publishedAt: result.publishedAt,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  @Mutation(() => Boolean, { description: '删除文章（软删除）' })
  @ValidateInput()
  async deletePost(@Args('id') id: string): Promise<boolean> {
    return this.deletePostUsecase.execute(id);
  }

  @Mutation(() => PostDto, { description: '切换文章置顶状态' })
  @ValidateInput()
  async togglePostTop(@Args('id') id: string): Promise<PostDto> {
    const result = await this.togglePostTopUsecase.execute(id);
    return this.toPostDto(result);
  }

  @Mutation(() => PostDto, { description: '发布文章' })
  @ValidateInput()
  async publishPost(@Args('id') id: string): Promise<PostDto> {
    const result = await this.publishPostUsecase.execute(id);
    return this.toPostDto(result);
  }

  @Mutation(() => PostDto, { description: '下架文章' })
  @ValidateInput()
  async unpublishPost(@Args('id') id: string): Promise<PostDto> {
    const result = await this.unpublishPostUsecase.execute(id);
    return this.toPostDto(result);
  }

  @Mutation(() => PostDto, { description: '恢复已删除的文章' })
  @ValidateInput()
  async restorePost(@Args('id') id: string): Promise<PostDto> {
    const result = await this.restorePostUsecase.execute(id);
    return this.toPostDto(result);
  }

  @Mutation(() => Number, { description: '增加文章阅读量' })
  @ValidateInput()
  async incrementPostView(@Args('id') id: string): Promise<number> {
    return this.incrementPostViewUsecase.execute(id);
  }

  @Query(() => PostConnection, { description: '回收站：查询已删除的文章' })
  @ValidateInput()
  async deletedPosts(
    @Args('input', { nullable: true }) input?: PostQueryInput,
  ): Promise<PostConnection> {
    const result = await this.listDeletedPostsUsecase.execute(input || {});
    return {
      items: result.items.map((item) => this.toPostDto(item)),
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
    };
  }

  private toPostDto(item: PostView): PostDto {
    return {
      id: item.id,
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt,
      content: item.content,
      contentHtml: item.contentHtml,
      status: item.status,
      isTop: item.isTop,
      viewCount: item.viewCount,
      likeCount: item.likeCount,
      commentCount: item.commentCount,
      categoryId: item.categoryId,
      categoryName: item.categoryName,
      tagIds: item.tagIds,
      tagNames: item.tagNames,
      publishedAt: item.publishedAt,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  }
}
