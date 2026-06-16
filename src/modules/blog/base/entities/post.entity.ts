// src/modules/blog/base/entities/post.entity.ts
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PostStatus } from '@app-types/models/blog.types';
import { CategoryEntity } from './category.entity';
import { CommentEntity } from './comment.entity';
import { TagEntity } from './tag.entity';

/**
 * 文章实体
 * 存储博客文章内容
 */
@Entity('blog_post')
@Index('idx_status', ['status'])
@Index('idx_published_at', ['publishedAt'])
@Index('idx_is_top', ['isTop'])
@Index('idx_slug', ['slug'], { unique: true })
export class PostEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', comment: '主键ID' })
  id!: string;

  @Column({ name: 'title', type: 'varchar', length: 200, comment: '文章标题' })
  title!: string;

  @Column({ name: 'slug', type: 'varchar', length: 200, comment: 'URL友好标识' })
  slug!: string;

  @Column({ name: 'content', type: 'longtext', comment: '文章内容（Markdown）' })
  content!: string;

  @Column({ name: 'summary', type: 'varchar', length: 500, nullable: true, comment: '文章摘要' })
  summary!: string | null;

  @Column({ name: 'excerpt', type: 'varchar', length: 500, nullable: true, comment: '文章摘录' })
  excerpt!: string | null;

  @Column({ name: 'content_html', type: 'longtext', nullable: true, comment: '文章内容（HTML）' })
  contentHtml!: string | null;

  @Column({
    name: 'cover_image',
    type: 'varchar',
    length: 500,
    nullable: true,
    comment: '封面图片URL',
  })
  coverImage!: string | null;

  @Column({ name: 'view_count', type: 'int', default: 0, comment: '阅读量' })
  viewCount!: number;

  @Column({ name: 'like_count', type: 'int', default: 0, comment: '点赞数' })
  likeCount!: number;

  @Column({ name: 'comment_count', type: 'int', default: 0, comment: '评论数' })
  commentCount!: number;

  @Column({ name: 'is_top', type: 'tinyint', default: 0, comment: '是否置顶：0-否，1-是' })
  isTop!: boolean;

  @Column({
    name: 'status',
    type: 'enum',
    enum: PostStatus,
    default: PostStatus.DRAFT,
    comment: '文章状态：DRAFT-草稿，PUBLISHED-已发布，ARCHIVED-已归档',
  })
  status!: PostStatus;

  @Column({
    name: 'published_at',
    type: 'datetime',
    precision: 3,
    nullable: true,
    comment: '发布时间',
  })
  publishedAt!: Date | null;

  @Column({ name: 'seo_title', type: 'varchar', length: 200, nullable: true, comment: 'SEO标题' })
  seoTitle!: string | null;

  @Column({
    name: 'seo_description',
    type: 'varchar',
    length: 500,
    nullable: true,
    comment: 'SEO描述',
  })
  seoDescription!: string | null;

  @ManyToOne(() => CategoryEntity, (category) => category.posts, { nullable: true })
  @Index('idx_category_id')
  category?: CategoryEntity;

  @Column({ name: 'category_id', type: 'bigint', nullable: true, comment: '分类ID' })
  categoryId!: string | null;

  @ManyToMany(() => TagEntity, (tag) => tag.posts)
  tags?: TagEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.post)
  comments?: CommentEntity[];

  @CreateDateColumn({
    name: 'created_at',
    type: 'datetime',
    precision: 3,
    default: () => 'CURRENT_TIMESTAMP(3)',
    comment: '创建时间',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'datetime',
    precision: 3,
    default: () => 'CURRENT_TIMESTAMP(3)',
    onUpdate: 'CURRENT_TIMESTAMP(3)',
    comment: '更新时间',
  })
  updatedAt!: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'datetime',
    precision: 3,
    nullable: true,
    comment: '软删除时间',
  })
  deletedAt!: Date | null;
}
