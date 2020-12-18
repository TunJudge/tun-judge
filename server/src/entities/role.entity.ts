import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from './user-role.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn({ comment: 'Role ID' })
  id: number;

  @Column({ comment: 'Role name', unique: true })
  name: string;

  @Column({ comment: 'Role description' })
  description: string;

  @OneToMany(() => UserRole, (ur) => ur.role)
  users: UserRole[];
}
