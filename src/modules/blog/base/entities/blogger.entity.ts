// src/modules/blog/base/entities/blogger.entity.ts
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * 博主信息实体
 * 整个系统只有一条博主信息记录
 */
@Entity('blog_blogger')
export class BloggerEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', comment: '主键ID' })
  id!: string;

  @Column({ name: 'nickname', type: 'varchar', length: 50, comment: '昵称' })
  nickname!: string;

  @Column({ name: 'avatar', type: 'varchar', length: 500, nullable: true, comment: '头像URL' })
  avatar!: string | null;

  @Column({ name: 'bio', type: 'text', nullable: true, comment: '个人简介' })
  bio!: string | null;

  @Column({ name: 'announcement', type: 'text', nullable: true, comment: '网站公告' })
  announcement!: string | null;

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
