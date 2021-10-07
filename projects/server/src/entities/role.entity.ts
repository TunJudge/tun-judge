import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Role {
  @ApiProperty({ description: 'Role name' })
  @Column({ comment: 'Role name', unique: true, primary: true })
  name: string;

  @ApiProperty({ description: 'Role description' })
  @Column({ comment: 'Role description' })
  description: string;

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
