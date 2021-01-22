import { compareSync } from 'bcrypt';
import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from './role.entity';
import { Team } from './team.entity';

@Entity()
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

  @OneToOne(() => Team, (team) => team.user, {
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
