import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ContestProblem } from './contest-problem.entity';
import { Submission } from './submission.entity';
import { Team } from './team.entity';

@Entity()
@Index(['id', 'enabled'])
export class Contest {
  @ApiProperty({ description: 'Contest ID', required: false })
  @PrimaryGeneratedColumn({ comment: 'Contest ID' })
  id: number;

  @ApiProperty({ description: 'Contest name' })
  @Column({ comment: 'Contest name' })
  name: string;

  @ApiProperty({ description: 'Contest short name' })
  @Column({ comment: 'Contest short name', unique: true })
  shortName: string;

  @ApiProperty({ description: 'Time contest become visible' })
  @Column({ comment: 'Time contest become visible' })
  activateTime: Date;

  @ApiProperty({ description: 'Time contest starts' })
  @Column({ comment: 'Time contest starts' })
  startTime: Date;

  @ApiProperty({ description: 'Time scoreboard is frozen', nullable: true, required: false })
  @Column({ comment: 'Time scoreboard is frozen', nullable: true })
  freezeTime: Date;

  @ApiProperty({
    description: 'Time contest end and no submissions are accepted',
    nullable: true,
    required: false,
  })
  @Column({ comment: 'Time contest end and no submissions are accepted' })
  endTime: Date;

  @ApiProperty({ description: 'Time scoreboard is unfrozen', nullable: true, required: false })
  @Column({ comment: 'Time scoreboard is unfrozen', nullable: true })
  unfreezeTime: Date;

  @ApiProperty({ description: 'Number of extra bronze medals', default: 0, required: false })
  @Column({
    comment: 'Number of extra bronze medals',
    type: 'smallint',
    default: 0,
  })
  extraBronzeMedals: number;

  @ApiProperty({ description: 'Whether the contest can be active', default: true })
  @Column({
    comment: 'Whether the contest can be active',
    default: true,
  })
  enabled: boolean;

  @ApiProperty({ description: 'Whether the balloons will be processed', default: false })
  @Column({
    comment: 'Whether the balloons will be processed',
    default: false,
  })
  processBalloons: boolean;

  @ApiProperty({ description: 'Whether the contest is visible for the public', default: true })
  @Column({
    comment: 'Whether the contest is visible for the public',
    default: true,
  })
  public: boolean;

  @ApiProperty({
    description: 'Whether the contest is open to any logged in team',
    default: false,
  })
  @Column({
    comment: 'Whether the contest is open to any logged in team',
    default: false,
  })
  openToAllTeams: boolean;

  @ApiProperty({
    description: 'Whether the submissions needs verification before showing the result to the team',
    default: false,
  })
  @Column({
    comment: 'Whether the submissions needs verification before showing the result to the team',
    default: false,
  })
  verificationRequired: boolean;

  @ApiProperty({
    description: 'Contest problems',
    type: [ContestProblem],
  })
  @OneToMany(() => ContestProblem, (cp) => cp.contest, {
    cascade: true,
  })
  problems: ContestProblem[];

  @ApiProperty({
    description: 'Teams participating to this contest',
    required: false,
    type: [Team],
  })
  @ManyToMany(() => Team, (team) => team.contests, { cascade: false })
  teams: Team[];

  @ApiProperty({
    description: 'Teams submissions in this contest',
    required: false,
    type: [Submission],
  })
  @OneToMany(() => Submission, (submission) => submission.contest, {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  })
  submissions: Submission[];
}
