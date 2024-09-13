import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Clarification } from './clarification.entity';
import { User } from './user.entity';

@Entity()
export class ClarificationMessage {
  @ApiProperty({ description: 'Clarification Message ID', required: false })
  @PrimaryGeneratedColumn({ comment: 'Clarification Message ID' })
  id: number;

  @ApiProperty({ description: 'The message content' })
  @Column({ comment: 'The message content' })
  content: string;

  @ApiProperty({ description: 'User sender' })
  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
    nullable: false,
  })
  sentBy: User;

  @ApiProperty({ description: 'Sent time' })
  @Column({ comment: 'The message sent time' })
  sentTime: Date;

  @ApiProperty({ description: 'The users that have seen this message', default: false })
  @ManyToMany(() => User, { cascade: false })
  @JoinTable()
  seenBy: User[];

  @ApiProperty({ description: 'Related clarification' })
  @ManyToOne(() => Clarification, (clarification) => clarification.messages, {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
    nullable: false,
  })
  clarification: Clarification;
}
