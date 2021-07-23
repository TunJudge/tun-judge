import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class FileContent {
  @ApiProperty({ description: 'File ID', required: false })
  @PrimaryGeneratedColumn({ comment: 'File ID' })
  id: number;

  @ApiProperty({ description: 'File Content' })
  @Column({ comment: 'File Content', type: 'text' })
  payload: string;
}
