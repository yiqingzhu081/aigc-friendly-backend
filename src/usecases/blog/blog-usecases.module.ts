import { Module } from '@nestjs/common';
import { BlogModule } from '@src/modules/blog/blog.module';
import { CreatePostUsecase } from './create-post.usecase';
import { DeletePostUsecase } from './delete-post.usecase';
import { GetPostUsecase } from './get-post.usecase';
import { ListPostsUsecase } from './list-posts.usecase';
import { UpdatePostUsecase } from './update-post.usecase';

@Module({
  imports: [BlogModule],
  providers: [
    CreatePostUsecase,
    UpdatePostUsecase,
    DeletePostUsecase,
    GetPostUsecase,
    ListPostsUsecase,
  ],
  exports: [
    CreatePostUsecase,
    UpdatePostUsecase,
    DeletePostUsecase,
    GetPostUsecase,
    ListPostsUsecase,
  ],
})
export class BlogUsecasesModule {}