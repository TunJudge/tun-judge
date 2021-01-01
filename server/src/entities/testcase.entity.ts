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
import { File } from './file.entity';

@Entity()
@Unique(['problem', 'rank'])
@Index(['problem'])
@Index(['sample'])
export class Testcase {
  @PrimaryGeneratedColumn({ comment: 'Test case ID' })
  id: number;

  @OneToOne(() => File, { cascade: true, eager: true, nullable: false })
  @JoinColumn()
  input: File;

  @OneToOne(() => File, { cascade: true, eager: true, nullable: false })
  @JoinColumn()
  output: File;

  @Column({ comment: 'Test case description', nullable: true })
  description: string;

  @OneToOne(() => File, { cascade: true, eager: true })
  @JoinColumn()
  image: File;

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

  @ManyToOne(() => Problem, (problem) => problem.testcases, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  })
  problem: Problem;
}
