import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Executable } from './executable.entity';

@Entity()
export class Language {
  @PrimaryGeneratedColumn({ comment: 'Language ID' })
  id: number;

  @Column({
    comment: 'Language ID in an external system',
    nullable: true,
    unique: true,
  })
  externalId: string;

  @Column({ comment: 'Language name' })
  name: string;

  @Column({
    comment: "Language's file possible extensions",
    type: 'json',
    default: [],
  })
  extensions: string[];

  @Column({
    comment: 'Whether submissions require a code entry point to be specified',
    default: false,
  })
  requireEntryPoint: boolean;

  @Column({
    comment: 'Entry point description',
  })
  entryPointDescription: string;

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

  @Column({
    comment: 'Language-specific factor multiplied by problem run times',
    type: 'float',
    default: 1.0,
  })
  timeFactor: number;

  @Column({
    comment:
      'Whether filter the files passed to the compiler by the extension list',
    default: true,
  })
  filterCompilerFiles: boolean;

  @ManyToOne(() => Executable, {
    onDelete: 'SET NULL',
    onUpdate: 'RESTRICT',
  })
  compileScript: Executable;
}
