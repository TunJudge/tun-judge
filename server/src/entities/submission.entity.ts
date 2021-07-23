import { ApiProperty } from '@nestjs/swagger';
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
@Index(['submitTime'])
export class Submission {
  @ApiProperty({ description: 'Submission ID', required: false })
  @PrimaryGeneratedColumn({ comment: 'Submission ID' })
  id: number;

  @ApiProperty({ description: 'Submission time' })
  @Column({ comment: 'Submission time' })
  submitTime: Date;

  @ApiProperty({
    description: 'If false, the submission should be ignored in all scoreboard calculation',
    default: true,
  })
  @Column({
    comment: 'If false, the submission should be ignored in all scoreboard calculation',
    default: true,
  })
  valid: boolean;

  @ApiProperty({ description: 'Related contest', type: () => Contest })
  @ManyToOne(() => Contest, (contest) => contest.submissions, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  })
  contest: Contest;

  @ApiProperty({ description: 'Related team', type: Team })
  @ManyToOne(() => Team, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  })
  team: Team;

  @ApiProperty({ description: 'Related problem', type: Problem })
  @ManyToOne(() => Problem, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  })
  problem: Problem;

  @ApiProperty({ description: 'Related language', type: Language })
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

  @ApiProperty({ description: 'Source file', type: File })
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
