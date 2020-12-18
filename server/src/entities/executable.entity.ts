import { Column, Entity, PrimaryColumn } from 'typeorm';

export type ExecutableType = 'COMPILE' | 'RUN';

@Entity()
export class Executable {
  @PrimaryColumn({ comment: 'Executable ID' })
  id: string;

  @Column({ comment: 'MD5Sum of the ZIP file' })
  md5Sum: string;

  @Column({ comment: 'The ZIP file', type: 'bytea' })
  zipFile: Buffer;

  @Column({ comment: 'Description of this executable' })
  description: string;

  @Column({
    comment: 'Type of this executable',
    type: 'enum',
    enum: ['COMPILE', 'RUN'],
  })
  type: ExecutableType;
}
