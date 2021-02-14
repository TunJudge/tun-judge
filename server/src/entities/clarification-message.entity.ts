import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Clarification } from './clarification.entity';
import { User } from './user.entity';

@Entity()
export class ClarificationMessage {
  @PrimaryGeneratedColumn({ comment: 'Clarification Message ID' })
  id: number;

  @Column({ comment: 'The message content', nullable: false })
  content: string;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
    nullable: false,
  })
  sentBy: User;

  @Column({ comment: 'The message sent time', nullable: false })
  sentTime: Date;

  @Column({ comment: 'Whether the message has been seen', default: false })
  seen: boolean;

  @ManyToOne(() => Clarification, (clarification) => clarification.messages, {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
    nullable: false,
  })
  clarification: Clarification;
}
