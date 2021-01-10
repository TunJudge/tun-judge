import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Contest } from './contest.entity';
import { Team } from './team.entity';
import { Problem } from './problem.entity';
import { Language } from './language.entity';
import { JudgeHost } from './judge-host.entity';
import { File } from './file.entity';

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

  @ManyToOne(() => Contest, {
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
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  })
  language: Language;

  @ManyToOne(() => JudgeHost, {
    onDelete: 'SET NULL',
    onUpdate: 'RESTRICT',
  })
  judgeHost: JudgeHost;

  @ManyToOne(() => Submission, {
    onDelete: 'SET NULL',
    onUpdate: 'RESTRICT',
  })
  originalSubmission: Submission;

  @OneToOne(() => File, { cascade: true, eager: true, nullable: false })
  @JoinColumn()
  file: File;
}
