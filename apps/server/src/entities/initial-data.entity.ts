import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class InitialDataEntity {
  @PrimaryGeneratedColumn({ comment: 'Initial Data ID' })
  id: number;

  @Column({ comment: 'When the initial data got stored in database', nullable: true })
  date: Date;
}
