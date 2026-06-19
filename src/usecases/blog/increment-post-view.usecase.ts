import { Inject, Injectable } from '@nestjs/common';
import { REDIS_CLIENT } from '@src/infrastructure/redis/redis.module';
import Redis from 'ioredis';
import { BlogQueryService } from '@src/modules/blog/queries/blog.query.service';
import type { PostView } from '@src/modules/blog/blog.types';

const POST_VIEW_COUNT_KEY_PREFIX = 'blog:post:view:';

@Injectable()
export class IncrementPostViewUsecase {
  constructor(
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
    private readonly blogQueryService: BlogQueryService,
  ) {}

  async execute(id: string): Promise<number> {
    const key = `${POST_VIEW_COUNT_KEY_PREFIX}${id}`;
    const count = await this.redis.incr(key);
    return count;
  }

  async getViewCount(id: string): Promise<number> {
    const key = `${POST_VIEW_COUNT_KEY_PREFIX}${id}`;
    const count = await this.redis.get(key);
    return count ? parseInt(count, 10) : 0;
  }

  async syncViewCountToDatabase(id: string): Promise<PostView> {
    const count = await this.getViewCount(id);
    // 这里需要调用 BlogService 来更新数据库中的 viewCount
    // 为了简化，我们暂时只返回 Redis 中的计数
    const post = await this.blogQueryService.getPostById({ id });
    if (!post) {
      throw new Error('文章不存在');
    }
    return {
      ...post,
      viewCount: count,
    };
  }
}