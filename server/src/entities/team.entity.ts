import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Contest } from './contest.entity';
import { TeamCategory } from './team-category.entity';
import { User } from './user.entity';

@Entity()
export class Team {
  @PrimaryGeneratedColumn({ comment: 'Team ID' })
  id: number;

  @Column({ comment: 'Team name', unique: true })
  name: string;

  @Column({
    comment: 'Whether the team is visible and operational',
    default: true,
  })
  enabled: boolean;

  @Column({ comment: 'Team physical location', nullable: true })
  room: string;

  @Column({ comment: 'Comments about this team', nullable: true })
  comments: string;

  @Column({ comment: 'Additional penalty time in minutes', default: 0 })
  penalty: number;

  @OneToMany(() => User, (user) => user.team, {
    onDelete: 'SET NULL',
    onUpdate: 'RESTRICT',
  })
  users: User[];

  @ManyToOne(() => TeamCategory, (category) => category.teams, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  category: TeamCategory;

  @ManyToMany(() => Contest, (contest) => contest.teams, { cascade: false })
  @JoinTable()
  contests: Contest[];
}
