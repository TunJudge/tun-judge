import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Contest } from './contest.entity';
import { Submission } from './submission.entity';
import { JudgeHost } from './judge-host.entity';
import { User } from './user.entity';
import { File } from './file.entity';

@Entity()
export class Judging {
  @PrimaryGeneratedColumn({ comment: 'Judging ID' })
  id: number;

  @Column({ comment: 'Judging start time' })
  startTime: Date;

  @Column({ comment: 'Judging end time', nullable: true })
  endTime: Date;

  @Column({ comment: 'Judging result', nullable: true })
  result: string;

  @Column({
    comment: 'Whether the judging was verified by a jury member',
    default: false,
  })
  verified: boolean;

  @Column({ comment: 'Judging verify comment', nullable: true })
  verifyComment: string;

  @Column({
    comment: 'Old Judging is marked as invalid when rejudging',
    default: true,
  })
  valid: boolean;

  @OneToOne(() => File, {
    cascade: true,
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn()
  compileOutput: File;

  @ManyToOne(() => User, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  juryMember: User;

  @ManyToOne(() => Contest, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  })
  contest: Contest;

  @ManyToOne(() => JudgeHost, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  judgeHost: JudgeHost;

  @ManyToOne(() => Submission, (submission) => submission.judgings, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  })
  submission: Submission;
}
