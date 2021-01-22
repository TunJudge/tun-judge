import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Contest } from './contest.entity';
import { File } from './file.entity';
import { JudgeHost } from './judge-host.entity';
import { Judging } from './judging.entity';
import { Language } from './language.entity';
import { Problem } from './problem.entity';
import { Team } from './team.entity';

@Entity()
@Index(['contest', 'team'])
@Index(['contest', 'problem'])
@Index(['team'])
@Index(['problem'])
@Index(['language'])
@Index(['judgeHost'])
@Index(['originalSubmission'])
export class Submission {
  @PrimaryGeneratedColumn({ comment: 'Submission ID' })
  id: number;

  @Column({ comment: 'Submission time' })
  submitTime: Date;

  @Column({
    comment:
      'If false, the submission should be ignored in all scoreboard calculation',
    default: true,
  })
  valid: boolean;

  @ManyToOne(() => Contest, (contest) => contest.submissions, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  })
  contest: Contest;

  @ManyToOne(() => Team, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  })
  team: Team;

  @ManyToOne(() => Problem, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  })
  problem: Problem;

  @ManyToOne(() => Language, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  language: Language;

  @ManyToOne(() => JudgeHost, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  judgeHost: JudgeHost;

  @ManyToOne(() => Submission, {
    onDelete: 'SET NULL',
    onUpdate: 'RESTRICT',
  })
  originalSubmission: Submission;

  @OneToOne(() => File, {
    cascade: true,
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
    nullable: false,
  })
  @JoinColumn()
  file: File;

  @OneToMany(() => Judging, (judging) => judging.submission, {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  })
  judgings: Judging[];
}
