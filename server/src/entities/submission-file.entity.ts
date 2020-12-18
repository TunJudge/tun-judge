import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Submission } from './submission.entity';

@Entity()
@Index(['submission'])
@Unique(['submission', 'rank'])
@Unique(['submission', 'fileName'])
export class SubmissionFile {
  @PrimaryGeneratedColumn({ comment: 'Submission File ID' })
  id: number;

  @ManyToOne(() => Submission, (submission) => submission.files, {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  })
  submission: Submission;

  @Column({ comment: 'Full source code', type: 'text' })
  sourceCode: string;

  @Column({ comment: 'File name' })
  fileName: string;

  @Column({ comment: 'Order in the submissions files, zero-indexed' })
  rank: number;
}
