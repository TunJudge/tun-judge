import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { File } from './file.entity';

export type ExecutableType = 'RUNNER' | 'CHECKER';

@Entity()
export class Executable {
  @PrimaryGeneratedColumn({ comment: 'Executable ID' })
  id: number;

  @Column({ comment: 'Executable Name' })
  name: string;

  @Column({ comment: 'Description of this executable', nullable: true })
  description: string;

  @Column({ comment: 'Description of this executable', default: false })
  default: boolean;

  @Column({ comment: 'Language Docker Image', nullable: true })
  dockerImage: string;

  @OneToOne(() => File, {
    cascade: true,
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
    nullable: false,
  })
  @JoinColumn()
  file: File;

  @OneToOne(() => File, {
    cascade: true,
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn()
  buildScript: File;

  @Column({
    comment: 'Type of this executable',
    type: 'enum',
    enum: ['RUNNER', 'CHECKER'],
  })
  type: ExecutableType;
}
