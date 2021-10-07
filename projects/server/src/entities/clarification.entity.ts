import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ClarificationMessage } from './clarification-message.entity';
import { Contest } from './contest.entity';
import { Problem } from './problem.entity';
import { Team } from './team.entity';

@Entity()
export class Clarification {
  @ApiProperty({ description: 'Clarification ID', required: false })
  @PrimaryGeneratedColumn({ comment: 'Clarification ID' })
  id: number;

  @ApiProperty({ description: 'Whether the Clarification is general', default: true })
  @Column({ comment: 'Whether the Clarification is general', default: true })
  general: boolean;

  @ApiProperty({
    description: 'Clarification messages list',
    required: false,
    type: [ClarificationMessage],
  })
  @OneToMany(() => ClarificationMessage, (message) => message.clarification, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  })
  messages: ClarificationMessage[];

  @ApiProperty({ description: 'Related contest' })
  @ManyToOne(() => Contest, {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
    nullable: false,
  })
  contest: Contest;

  @ApiProperty({ description: 'Related Problem' })
  @ManyToOne(() => Problem, {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  })
  problem: Problem;

  @ApiProperty({ description: 'Related team' })
  @ManyToOne(() => Team, {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  })
  team: Team;
}
