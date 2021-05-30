import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ClarificationMessage } from './clarification-message.entity';
import { Contest } from './contest.entity';
import { Problem } from './problem.entity';
import { Team } from './team.entity';

@Entity()
export class Clarification {
  @PrimaryGeneratedColumn({ comment: 'Clarification ID' })
  id: number;

  @Column({ comment: 'Whether the Clarification is general', default: true })
  general: boolean;

  @OneToMany(() => ClarificationMessage, (message) => message.clarification, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  })
  messages: ClarificationMessage[];

  @ManyToOne(() => Contest, {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
    nullable: false,
  })
  contest: Contest;

  @ManyToOne(() => Problem, {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  })
  problem: Problem;

  @ManyToOne(() => Team, {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  })
  team: Team;
}
