import { Column, Entity, Index, ManyToOne, Unique } from 'typeorm';
import { Contest } from './contest.entity';
import { Problem } from './problem.entity';

@Entity()
@Index(['contest', 'problem'])
@Unique(['contest', 'shortName'])
export class ContestProblem {
  @ManyToOne(() => Contest, (contest) => contest.problems, {
    primary: true,
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  contest: Contest;

  @ManyToOne(() => Problem, (problem) => problem.contests, {
    primary: true,
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  problem: Problem;

  @Column()
  shortName: string;

  @Column({
    comment: 'Number of points earned by solving this problem',
    default: 1,
  })
  points: number;

  @Column({
    comment: 'Whether to accept submissions for this problem',
    default: true,
  })
  allowSubmit: boolean;

  @Column({
    comment: 'Whether to judge the submissions of this problem',
    default: true,
  })
  allowJudge: boolean;

  @Column({
    comment: 'Problem balloon color',
    nullable: true,
  })
  color: string;
}
