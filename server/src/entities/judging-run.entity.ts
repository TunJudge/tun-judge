import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { File } from './file.entity';
import { Judging } from './judging.entity';
import { Testcase } from './testcase.entity';

@Entity()
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

  @ManyToOne(() => Judging, {
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
