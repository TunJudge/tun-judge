import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FileContent } from './file-content.entity';

@Entity()
export class File {
  @PrimaryGeneratedColumn({ comment: 'File ID' })
  id: number;

  @Column({ comment: 'File name' })
  name: string;

  @Column({ comment: 'File type' })
  type: string;

  @Column({ comment: 'File size' })
  size: number;

  @Column({ comment: 'File MD5 sum' })
  md5Sum: string;

  @OneToOne(() => FileContent, {
    cascade: true,
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
    nullable: false,
  })
  @JoinColumn()
  content: FileContent;
}
