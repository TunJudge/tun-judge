import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class JudgeHost {
  @PrimaryColumn({ comment: 'Judge host hostname', unique: true })
  hostname: string;

  @Column({ comment: 'Whether the judge host is enabled', default: true })
  active: boolean;

  @Column({ comment: 'Time of last poll', nullable: true })
  pollTime: Date;
}
