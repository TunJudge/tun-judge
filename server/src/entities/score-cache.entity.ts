import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { Contest } from './contest.entity';
import { Problem } from './problem.entity';
import { Team } from './team.entity';

@Entity()
@Index(['team'])
@Index(['problem'])
@Index(['contest'])
export class ScoreCache {
  @ManyToOne(() => Contest, {
    primary: true,
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  })
  contest: Contest;

  @ManyToOne(() => Team, {
    primary: true,
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  })
  team: Team;

  @ManyToOne(() => Problem, {
    primary: true,
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  })
  problem: Problem;

  @Column({ comment: 'Number of submissions made (public)', default: 0 })
  submissions: number;

  @Column({ comment: 'Number of pending submissions (public)', default: 0 })
  pending: number;

  @Column({
    comment: 'Time when the problem was solved (public)',
    nullable: true,
  })
  solveTime: Date;

  @Column({
    comment: 'Whether there is a correct submission (public)',
    default: false,
  })
  correct: boolean;

  @Column({
    comment: 'Whether there is the first solution for this problem',
    default: false,
  })
  firstToSolve: boolean;

  @Column({ comment: 'Number of submissions made (restricted)', default: 0 })
  restrictedSubmissions: number;

  @Column({ comment: 'Number of pending submissions (restricted)', default: 0 })
  restrictedPending: number;

  @Column({
    comment: 'Time when the problem was solved (restricted)',
    nullable: true,
  })
  restrictedSolveTime: Date;

  @Column({
    comment: 'Whether there is a correct submission (restricted)',
    default: false,
  })
  restrictedCorrect: boolean;
}
