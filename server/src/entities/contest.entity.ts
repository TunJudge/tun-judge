import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ContestProblem } from './contest-problem.entity';

@Entity()
@Index(['id', 'enabled'])
export class Contest {
  @PrimaryGeneratedColumn({ comment: 'Contest ID' })
  id: number;

  @Column({
    comment: 'Contest ID in an external system',
    nullable: true,
    unique: true,
  })
  externalId: string;

  @Column({ comment: 'Contest name' })
  name: string;

  @Column({ comment: 'Contest short name', unique: true })
  shortName: string;

  @Column({ comment: 'Time contest become visible' })
  activateTime: Date;

  @Column({ comment: 'Time contest starts' })
  startTime: Date;

  @Column({ comment: 'Time scoreboard is frozen' })
  freezeTime: Date;

  @Column({ comment: 'Time contest end and no submissions are accepted' })
  endTime: Date;

  @Column({ comment: 'Time scoreboard is unfrozen' })
  unfreezeTime: Date;

  @Column({
    comment: 'Time contest is finalized',
    nullable: true,
  })
  finalizeTime: Date;

  @Column({ comment: 'Comment of the finalizer' })
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
    default: true,
  })
  processBalloons: boolean;

  @Column({
    comment: 'Whether the contest is visible for the public',
    default: true,
  })
  public: boolean;

  @OneToMany(() => ContestProblem, (cp) => cp.contest)
  problems: ContestProblem[];
}
