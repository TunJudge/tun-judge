import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class FileContent {
  @PrimaryGeneratedColumn({ comment: 'File ID' })
  id: number;

  @Column({ comment: 'File Content', type: 'text' })
  payload: string;
}
