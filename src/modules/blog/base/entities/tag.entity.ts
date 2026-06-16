// src/modules/blog/base/entities/tag.entity.ts
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PostEntity } from './post.entity';

/**
 * 标签实体
 * 文章的多对多关系
 */
@Entity('blog_tag')
@Index('idx_slug', ['slug'], { unique: true })
export class TagEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', comment: '主键ID' })
  id!: string;

  @Column({ name: 'name', type: 'varchar', length: 30, comment: '标签名称' })
  name!: string;

  @Column({ name: 'slug', type: 'varchar', length: 30, comment: 'URL友好标识' })
  slug!: string;

  @ManyToMany(() => PostEntity, (post) => post.tags)
  posts?: PostEntity[];

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
