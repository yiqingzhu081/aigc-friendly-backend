// src/modules/blog/base/entities/file.entity.ts
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

/**
 * 文件实体
 * 存储上传的文件信息
 */
@Entity('blog_file')
@Index('idx_mime_type', ['mimeType'])
export class FileEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', comment: '主键ID' })
  id!: string;

  @Column({ name: 'filename', type: 'varchar', length: 255, comment: '存储文件名' })
  filename!: string;

  @Column({ name: 'original_name', type: 'varchar', length: 255, comment: '原始文件名' })
  originalName!: string;

  @Column({ name: 'mime_type', type: 'varchar', length:100, comment: 'MIME类型' })
  mimeType!: string;

  @Column({ name: 'size', type: 'bigint', comment: '文件大小（字节）' })
  size!: number;

  @Column({ name: 'url', type: 'varchar', length: 500, comment: '文件访问URL' })
  url!: string;

  @Column({ name: 'uploader_id', type: 'bigint', nullable: true, comment: '上传者ID' })
  uploaderId!: string | null;

  @CreateDateColumn({
    name: 'created_at',
    type: 'datetime',
    precision: 3,
    default: () => 'CURRENT_TIMESTAMP(3)',
    comment: '上传时间',
  })
  createdAt!: Date;
}
