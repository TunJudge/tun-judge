import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ContestProblem } from './contest-problem.entity';
import { Executable } from './executable.entity';
import { Testcase } from './testcase.entity';
import { File } from './file.entity';

@Entity()
export class Problem {
  @PrimaryGeneratedColumn({ comment: 'Problem ID' })
  id: number;

  @Column({ comment: 'Problem name' })
  name: string;

  @Column({
    comment: 'Problem maximum run time (in seconds)',
    type: 'float',
    default: 0,
  })
  timeLimit: number;

  @Column({ comment: 'Problem maximum memory (in kB)', default: 2097152 })
  memoryLimit: number;

  @Column({ comment: 'Problem maximum output size (in kB)', default: 8192 })
  outputLimit: number;

  @OneToOne(() => File, {
    cascade: true,
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
    nullable: false,
  })
  @JoinColumn()
  file: File;

  @ManyToOne(() => Executable, {
    onDelete: 'SET NULL',
    onUpdate: 'RESTRICT',
    nullable: true,
  })
  specialRunScript: Executable;

  @ManyToOne(() => Executable, {
    onDelete: 'SET NULL',
    onUpdate: 'RESTRICT',
    nullable: true,
  })
  specialCompareScript: Executable;

  @Column({
    comment: 'Optional args for the special compare script',
    nullable: true,
  })
  specialCompareArgs: string;

  @OneToMany(() => ContestProblem, (cp) => cp.problem)
  contests: ContestProblem[];

  @OneToMany(() => Testcase, (testcase) => testcase.problem)
  testcases: Testcase[];
}
