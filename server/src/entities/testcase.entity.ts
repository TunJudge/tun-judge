import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Problem } from './problem.entity';
import { TestcaseContent } from './testcase-content.entity';

@Entity()
@Unique(['problem', 'rank'])
@Index(['problem'])
@Index(['sample'])
export class Testcase {
  @PrimaryGeneratedColumn({ comment: 'Test case ID' })
  id: number;

  @Column({ comment: 'Checksum of the input data' })
  inputMD5Sum: string;

  @Column({ comment: 'Checksum of the input data' })
  outputMD5Sum: string;

  @Column({ comment: 'Test case description', nullable: true })
  description: string;

  @Column({ comment: 'Test case rank for judging' })
  rank: number;

  @Column({
    comment: 'Whether the test case can be shared with the teams',
    default: false,
  })
  sample: boolean;

  @Column({
    comment: 'Deleted testcase are kept for referential integrity',
    default: false,
  })
  deleted: boolean;

  @OneToOne(() => TestcaseContent, (content) => content.testcase, {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  })
  content: TestcaseContent;

  @ManyToOne(() => Problem, (problem) => problem.testcases, {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  })
  problem: Problem;
}
