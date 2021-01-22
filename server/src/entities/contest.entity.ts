import {
  Column,
  Entity,
  Index,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ContestProblem } from './contest-problem.entity';
import { Team } from './team.entity';
import { Submission } from './submission.entity';

@Entity()
@Index(['id', 'enabled'])
export class Contest {
  @PrimaryGeneratedColumn({ comment: 'Contest ID' })
  id: number;

  @Column({ comment: 'Contest name' })
  name: string;

  @Column({ comment: 'Contest short name', unique: true })
  shortName: string;

  @Column({ comment: 'Time contest become visible' })
  activateTime: Date;

  @Column({ comment: 'Time contest starts' })
  startTime: Date;

  @Column({ comment: 'Time scoreboard is frozen', nullable: true })
  freezeTime: Date;

  @Column({ comment: 'Time contest end and no submissions are accepted' })
  endTime: Date;

  @Column({ comment: 'Time scoreboard is unfrozen', nullable: true })
  unfreezeTime: Date;

  @Column({
    comment: 'Time contest is finalized',
    nullable: true,
  })
  finalizeTime: Date;

  @Column({ comment: 'Comment of the finalizer', nullable: true })
  finalizeComment: string;

  @Column({
    comment: 'Number of extra bronze medals',
    type: 'smallint',
    default: 0,
  })
  extraBronzeMedals: number;

  @Column({
    comment: 'Whether the contest can be active',
    default: true,
  })
  enabled: boolean;

  @Column({
    comment: 'Whether the balloons will be processed',
    default: false,
  })
  processBalloons: boolean;

  @Column({
    comment: 'Whether the contest is visible for the public',
    default: true,
  })
  public: boolean;

  @Column({
    comment: 'Whether the contest is open to any logged in team',
    default: false,
  })
  openToAllTeams: boolean;

  @Column({
    comment:
      'Whether the submissions needs verification before showing the result to the team',
    default: false,
  })
  verificationRequired: boolean;

  @OneToMany(() => ContestProblem, (cp) => cp.contest, {
    cascade: true,
  })
  problems: ContestProblem[];

  @ManyToMany(() => Team, (team) => team.contests, { cascade: false })
  teams: Team[];

  @OneToMany(() => Submission, (submission) => submission.contest, {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  })
  submissions: Submission[];
}
