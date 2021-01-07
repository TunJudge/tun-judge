import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { compareSync } from 'bcrypt';
import { Team } from './team.entity';
import { Role } from './role.entity';

@Entity()
@Index(['team'])
export class User {
  @PrimaryGeneratedColumn({ comment: 'User ID' })
  id: number;

  @Column({ comment: 'User full name' })
  name: string;

  @Column({ comment: 'User login', unique: true })
  username: string;

  @Column({ comment: 'User password hash', nullable: false })
  password: string;

  @Column({ comment: 'User email address', nullable: true })
  email: string;

  @Column({ comment: 'User last successful login', nullable: true })
  lastLogin: Date;

  @Column({
    comment: 'User last IP address of successful login',
    nullable: true,
  })
  lastIpAddress: string;

  @Column({
    comment: 'Whether the user is able to log in',
    default: true,
  })
  enabled: boolean;

  @Column({
    comment: 'User Express session ID',
    nullable: true,
    select: false,
  })
  sessionId: string;

  @ManyToOne(() => Team, (team) => team.users, {
    onDelete: 'SET NULL',
    onUpdate: 'RESTRICT',
  })
  team: Team;

  @ManyToOne(() => Role, (role) => role.users, {
    nullable: false,
    eager: true,
  })
  role: Role;

  checkPassword = (password: string): boolean =>
    compareSync(password, this.password);

  clean = (): this => {
    delete this.password;
    return this;
  };
}
