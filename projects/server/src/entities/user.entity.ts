import { ApiProperty } from '@nestjs/swagger';
import { compareSync } from 'bcrypt';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from './role.entity';
import { Team } from './team.entity';

@Entity()
export class User {
  @ApiProperty({ description: 'User ID', required: false })
  @PrimaryGeneratedColumn({ comment: 'User ID' })
  id: number;

  @ApiProperty({ description: 'User full name' })
  @Column({ comment: 'User full name' })
  name: string;

  @ApiProperty({ description: 'User login' })
  @Column({ comment: 'User login', unique: true })
  username: string;

  @ApiProperty({ description: 'User password' })
  @Column({ comment: 'User password hash' })
  password: string;

  @ApiProperty({ description: 'User email address', nullable: true, required: false })
  @Column({ comment: 'User email address', nullable: true })
  email: string;

  @ApiProperty({ description: 'User last successful login', nullable: true, required: false })
  @Column({ comment: 'User last successful login', nullable: true })
  lastLogin: Date;

  @ApiProperty({
    description: 'User last IP address of successful login',
    nullable: true,
    required: false,
  })
  @Column({
    comment: 'User last IP address of successful login',
    nullable: true,
  })
  lastIpAddress: string;

  @ApiProperty({
    description: 'Whether the user is able to log in',
    required: false,
    default: true,
  })
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

  @ApiProperty({
    description: 'User team',
    required: false,
    nullable: true,
  })
  @ManyToOne(() => Team, (team) => team.users, {
    onDelete: 'SET NULL',
    onUpdate: 'RESTRICT',
  })
  team: Team;

  @ApiProperty({ description: 'User role' })
  @ManyToOne(() => Role, (role) => role.users, {
    nullable: false,
    eager: true,
  })
  role: Role;

  checkPassword = (password: string): boolean => compareSync(password, this.password);

  clean = (): this => {
    delete this.password;
    return this;
  };
}
