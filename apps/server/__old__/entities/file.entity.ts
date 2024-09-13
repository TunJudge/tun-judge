import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { FileContent } from './file-content.entity';

@Entity()
export class File {
  @ApiProperty({ description: 'File ID', required: false })
  @PrimaryGeneratedColumn({ comment: 'File ID' })
  id: number;

  @ApiProperty({ description: 'File name' })
  @Column({ comment: 'File name' })
  name: string;

  @ApiProperty({ description: 'File type' })
  @Column({ comment: 'File type' })
  type: string;

  @ApiProperty({ description: 'File size' })
  @Column({ comment: 'File size' })
  size: number;

  @ApiProperty({ description: 'File MD5 checksum' })
  @Column({ comment: 'File MD5 checksum' })
  md5Sum: string;

  @ApiProperty({ description: 'File content' })
  @OneToOne(() => FileContent, {
    cascade: true,
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
    nullable: false,
  })
  @JoinColumn()
  content: FileContent;
}
