import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { File } from './file.entity';
import { Judging } from './judging.entity';
import { Testcase } from './testcase.entity';

@Entity()
@Unique(['judging', 'testcase'])
export class JudgingRun {
  @PrimaryGeneratedColumn({ comment: 'Judging Run ID' })
  id: number;

  @Column({ comment: 'Judging Run result', nullable: true })
  result: string;

  @Column({ comment: 'Judging Run end time' })
  endTime: Date;

  @Column({
    comment: 'Submission running time on this testcase',
    type: 'float',
  })
  runTime: number;

  @Column({
    comment: 'Submission used memory on this testcase',
    type: 'float',
  })
  runMemory: number;

  @ManyToOne(() => Judging, (judging) => judging.runs, {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  })
  judging: Judging;

  @ManyToOne(() => Testcase, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  testcase: Testcase;

  @OneToOne(() => File, {
    cascade: true,
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn()
  runOutput: File;

  @OneToOne(() => File, {
    cascade: true,
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn()
  errorOutput: File;

  @OneToOne(() => File, {
    cascade: true,
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn()
  checkerOutput: File;
}
