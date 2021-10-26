import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { File } from './file.entity';

@Entity()
export class Language {
  @ApiProperty({ description: 'Language ID', required: false })
  @PrimaryGeneratedColumn({ comment: 'Language ID' })
  id: number;

  @ApiProperty({ description: 'Language name' })
  @Column({ comment: 'Language name', unique: true })
  name: string;

  @ApiProperty({ description: 'Language Docker Image' })
  @Column({ comment: 'Language Docker Image' })
  dockerImage: string;

  @ApiProperty({
    description: "Language's file possible extensions",
    type: 'json',
    default: [],
  })
  @Column({
    comment: "Language's file possible extensions",
    type: 'json',
    default: [],
  })
  extensions: string[];

  @ApiProperty({
    description: 'Whether to accept submissions with this language',
    default: true,
  })
  @Column({
    comment: 'Whether to accept submissions with this language',
    default: true,
  })
  allowSubmit: boolean;

  @ApiProperty({
    description: 'Whether to judge submissions with this language',
    default: true,
  })
  @Column({
    comment: 'Whether to judge submissions with this language',
    default: true,
  })
  allowJudge: boolean;

  @ApiProperty({ description: 'Build script source file' })
  @OneToOne(() => File, {
    cascade: true,
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
    nullable: false,
  })
  @JoinColumn()
  buildScript: File;
}
