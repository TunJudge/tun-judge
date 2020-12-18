import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Team {
  @PrimaryGeneratedColumn({ comment: 'Team ID' })
  id: number;

  @Column({ comment: 'Team name' })
  name: string;

  @Column({ comment: 'Team display name' })
  displayName: string;

  @Column({
    comment: 'Whether the team is visible and operational',
    default: true,
  })
  enabled: boolean;

  @Column({ comment: 'Team member names', nullable: true })
  members: string;

  @Column({ comment: 'Team physical location', nullable: true })
  room: string;

  @Column({ comment: 'Comments about this team', nullable: true })
  comments: string;

  @Column({ comment: 'Additional penalty time in minutes', default: 0 })
  penalty: number;

  @OneToMany(() => User, (user) => user.team)
  users: User[];
}
