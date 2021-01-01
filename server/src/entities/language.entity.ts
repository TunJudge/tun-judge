import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { File } from './file.entity';

@Entity()
export class Language {
  @PrimaryGeneratedColumn({ comment: 'Language ID' })
  id: number;

  @Column({ comment: 'Language name' })
  name: string;

  @Column({
    comment: "Language's file possible extensions",
    type: 'json',
    default: [],
  })
  extensions: string[];

  @Column({
    comment: 'Whether to accept submissions with this language',
    default: true,
  })
  allowSubmit: boolean;

  @Column({
    comment: 'Whether to judge submissions with this language',
    default: true,
  })
  allowJudge: boolean;

  @OneToOne(() => File, {
    cascade: true,
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
    nullable: false,
  })
  @JoinColumn()
  buildScript: File;

  @OneToOne(() => File, {
    cascade: true,
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
    nullable: false,
  })
  @JoinColumn()
  runScript: File;
}
