import { Module } from '@nestjs/common';
import { BlogModule } from '@src/modules/blog/blog.module';
import { RedisModule } from '@src/infrastructure/redis/redis.module';
import { CreatePostUsecase } from './create-post.usecase';
import { DeletePostUsecase } from './delete-post.usecase';
import { GetPostUsecase } from './get-post.usecase';
import { ListPostsUsecase } from './list-posts.usecase';
import { UpdatePostUsecase } from './update-post.usecase';
import { TogglePostTopUsecase } from './toggle-post-top.usecase';
import { PublishPostUsecase } from './publish-post.usecase';
import { UnpublishPostUsecase } from './unpublish-post.usecase';
import { RestorePostUsecase } from './restore-post.usecase';
import { IncrementPostViewUsecase } from './increment-post-view.usecase';
import { ListDeletedPostsUsecase } from './list-deleted-posts.usecase';

@Module({
  imports: [BlogModule, RedisModule],
  providers: [
    CreatePostUsecase,
    UpdatePostUsecase,
    DeletePostUsecase,
    GetPostUsecase,
    ListPostsUsecase,
    TogglePostTopUsecase,
    PublishPostUsecase,
    UnpublishPostUsecase,
    RestorePostUsecase,
    IncrementPostViewUsecase,
    ListDeletedPostsUsecase,
  ],
  exports: [
    CreatePostUsecase,
    UpdatePostUsecase,
    DeletePostUsecase,
    GetPostUsecase,
    ListPostsUsecase,
    TogglePostTopUsecase,
    PublishPostUsecase,
    UnpublishPostUsecase,
    RestorePostUsecase,
    IncrementPostViewUsecase,
    ListDeletedPostsUsecase,
  ],
})
export class BlogUsecasesModule {}