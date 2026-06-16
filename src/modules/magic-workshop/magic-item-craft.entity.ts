import { MagicItemCraftStatus, MagicItemQuality, MagicItemType } from './magic-workshop.types';
import { Column, CreateDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('magic_item_craft')
@Index('idx_status', ['status'])
@Index('idx_created_at', ['createdAt'])
export class MagicItemCraftEntity {
  @PrimaryColumn({ type: 'varchar', length: 36, comment: '制作任务ID (UUID)' })
  id!: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    comment: '道具名称',
  })
  itemName!: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
    comment: '道具类型',
  })
  itemType!: MagicItemType;

  @Column({
    type: 'int',
    nullable: false,
    comment: '材料等级 (1-5)',
  })
  materialLevel!: number;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
    comment: '用户备注',
  })
  requestNote!: string | null;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
    default: MagicItemCraftStatus.PENDING,
    comment: '制作状态',
  })
  status!: MagicItemCraftStatus;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    comment: '品质等级',
  })
  qualityLevel!: MagicItemQuality | null;

  @Column({
    type: 'text',
    nullable: true,
    comment: '生成的道具描述',
  })
  resultDescription!: string | null;

  @Column({
    type: 'text',
    nullable: true,
    comment: '制作日志',
  })
  craftLog!: string | null;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
    comment: '失败原因',
  })
  failureReason!: string | null;

  @Column({
    type: 'varchar',
    length: 36,
    nullable: true,
    comment: '关联的队列任务ID',
  })
  jobId!: string | null;

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
