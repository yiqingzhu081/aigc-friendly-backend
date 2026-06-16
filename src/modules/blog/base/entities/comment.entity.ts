// src/modules/blog/base/entities/comment.entity.ts
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PostEntity } from './post.entity';

/**
 * 评论状态枚举
 */
export enum CommentStatus {
  PENDING = 'PENDING', // 待审核
  APPROVED = 'APPROVED', // 已通过
  REJECTED = 'REJECTED', // 已驳回
  HIDDEN = 'HIDDEN', // 已隐藏
}

/**
 * 评论实体
 * 支持多级嵌套（楼中楼）
 */
@Entity('blog_comment')
@Index('idx_post_id', ['postId'])
@Index('idx_parent_id', ['parentId'])
@Index('idx_status', ['status'])
export class CommentEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', comment: '主键ID' })
  id!: string;

  @Column({ name: 'post_id', type: 'bigint', comment: '文章ID' })
  postId!: string;

  @ManyToOne(() => PostEntity, (post) => post.comments, { nullable: true })
  post?: PostEntity | null;

  @Column({
    name: 'parent_id',
    type: 'bigint',
    nullable: true,
    comment: '父评论ID（用于嵌套回复）',
  })
  parentId!: string | null;

  @ManyToOne(() => CommentEntity, (comment) => comment.children, { nullable: true })
  parent?: CommentEntity | null;

  @OneToMany(() => CommentEntity, (comment) => comment.parent)
  children?: CommentEntity[];

  @Column({
    name: 'level',
    type: 'tinyint',
    default: 1,
    comment: '嵌套层级（1-3，最多3层）',
  })
  level!: number;

  @Column({ name: 'author_name', type: 'varchar', length: 50, comment: '评论者昵称' })
  authorName!: string;

  @Column({ name: 'author_email', type: 'varchar', length: 100, comment: '评论者邮箱' })
  authorEmail!: string;

  @Column({
    name: 'author_avatar',
    type: 'varchar',
    length: 500,
    nullable: true,
    comment: '评论者头像URL',
  })
  authorAvatar!: string | null;

  @Column({ name: 'content', type: 'text', comment: '评论内容' })
  content!: string;

  @Column({
    name: 'status',
    type: 'enum',
    enum: CommentStatus,
    default: CommentStatus.PENDING,
    comment: '评论状态：PENDING-待审核，APPROVED-已通过，REJECTED-已驳回，HIDDEN-已隐藏',
  })
  status!: CommentStatus;

  @Column({
    name: 'reject_reason',
    type: 'varchar',
    length: 200,
    nullable: true,
    comment: '驳回原因',
  })
  rejectReason!: string | null;

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
}
