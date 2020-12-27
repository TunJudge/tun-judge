import { Column, Entity, OneToMany } from 'typeorm';
import { UserRole } from './user-role.entity';

@Entity()
export class Role {
  @Column({ comment: 'Role name', primary: true })
  name: string;

  @Column({ comment: 'Role description' })
  description: string;

  @OneToMany(() => UserRole, (ur) => ur.role, {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  })
  users: UserRole[];
}
