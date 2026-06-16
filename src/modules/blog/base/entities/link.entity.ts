// src/modules/blog/base/entities/link.entity.ts
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * 友链状态枚举
 */
export enum LinkStatus {
  PENDING = 'PENDING', // 待审核
  APPROVED = 'APPROVED', // 已通过
  REJECTED = 'REJECTED', // 已驳回
}

/**
 * 友情链接实体
 */
@Entity('blog_link')
@Index('idx_status', ['status'])
export class LinkEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', comment: '主键ID' })
  id!: string;

  @Column({ name: 'name', type: 'varchar', length: 50, comment: '网站名称' })
  name!: string;

  @Column({ name: 'url', type: 'varchar', length: 500, comment: '网站URL' })
  url!: string;

  @Column({ name: 'logo', type: 'varchar', length: 500, nullable: true, comment: '网站Logo URL' })
  logo!: string | null;

  @Column({ name: 'description', type: 'varchar', length: 200, nullable: true, comment: '网站描述' })
  description!: string | null;

  @Column({ name: 'sort_order', type: 'int', default: 0, comment: '排序顺序' })
  sortOrder!: number;

  @Column({
    name: 'status',
    type: 'enum',
    enum: LinkStatus,
    default: LinkStatus.PENDING,
    comment: '友链状态：PENDING-待审核，APPROVED-已通过，REJECTED-已驳回',
  })
  status!: LinkStatus;

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
