import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class JudgeHost {
  @PrimaryGeneratedColumn({ comment: 'Judge host ID' })
  id: number;

  @Column({ comment: 'Judge host hostname', unique: true })
  hostname: string;

  @Column({ comment: 'Whether the judge host is enabled', default: true })
  active: boolean;

  @Column({ comment: 'Time of last poll', nullable: true })
  pollTime: Date;

  @OneToOne(() => User, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn()
  user: User;
}
