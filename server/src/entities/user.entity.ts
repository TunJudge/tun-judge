import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  Index,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Team } from './team.entity';
import { UserRole } from './user-role.entity';

@Entity()
@Index(['team'])
export class User {
  @PrimaryGeneratedColumn({ comment: 'User ID' })
  id: number;

  @Column({ comment: 'User full name' })
  name: string;

  @Column({ comment: 'User login', unique: true })
  username: string;

  @Column({ comment: 'User password hash', nullable: true })
  password: string;

  @Column({ comment: 'User email address', nullable: true })
  email: string;

  @Column({ comment: 'User last successful login', nullable: true })
  lastLogin: Date;

  @Column({
    comment: 'User last IP address of successful login',
    nullable: true,
  })
  lastIpAddress: Date;

  @Column({
    comment: 'Whether the user is able to log in',
    default: true,
  })
  enabled: boolean;

  @ManyToOne(() => Team, (team) => team.users, {
    onDelete: 'SET NULL',
    onUpdate: 'RESTRICT',
  })
  team: Team;

  @OneToMany(() => UserRole, (ur) => ur.user)
  roles: UserRole[];
}
