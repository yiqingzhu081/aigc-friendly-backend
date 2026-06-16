// src/modules/blog/base/entities/category.entity.ts
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
 * 分类实体
 * 支持树形结构（自引用）
 */
@Entity('blog_category')
@Index('idx_slug', ['slug'], { unique: true })
@Index('idx_parent_id', ['parentId'])
export class CategoryEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', comment: '主键ID' })
  id!: string;

  @Column({ name: 'name', type: 'varchar', length: 50, comment: '分类名称' })
  name!: string;

  @Column({ name: 'slug', type: 'varchar', length: 50, comment: 'URL友好标识' })
  slug!: string;

  @Column({ name: 'description', type: 'varchar', length: 200, nullable: true, comment: '分类描述' })
  description!: string | null;

  @Column({ name: 'parent_id', type: 'bigint', nullable: true, comment: '父分类ID' })
  parentId!: string | null;

  @ManyToOne(() => CategoryEntity, (category) => category.children, { nullable: true })
  parent?: CategoryEntity | null;

  @OneToMany(() => CategoryEntity, (category) => category.parent)
  children?: CategoryEntity[];

  @Column({ name: 'sort_order', type: 'int', default: 0, comment: '排序顺序' })
  sortOrder!: number;

  @OneToMany(() => PostEntity, (post) => post.category)
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
