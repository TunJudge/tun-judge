import { Entity, Index, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Role } from './role.entity';

@Entity()
@Index(['user', 'role'])
export class UserRole {
  @ManyToOne(() => User, (user) => user.roles, {
    primary: true,
    eager: true,
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  })
  user: User;

  @ManyToOne(() => Role, (role) => role.users, {
    primary: true,
    eager: true,
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  })
  role: Role;
}
