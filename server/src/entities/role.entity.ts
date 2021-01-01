import { Column, Entity, OneToMany } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Role {
  @Column({ comment: 'Role name', unique: true, primary: true })
  name: string;

  @Column({ comment: 'Role description' })
  description: string;

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
