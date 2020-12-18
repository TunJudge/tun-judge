import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Testcase } from './testcase.entity';

@Entity()
export class TestcaseContent {
  @OneToOne(() => Testcase, (testcase) => testcase.content, {
    primary: true,
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn()
  testcase: Testcase;

  @Column({ comment: 'Input Data', type: 'text' })
  input: string;

  @Column({ comment: 'Output Data', type: 'text' })
  output: string;

  @Column({
    comment: 'A graphical representation of the testcase',
    type: 'text',
    nullable: true,
  })
  image: string;

  @Column({ comment: 'Testcase descriptive image type', nullable: true })
  imageType: string;
}
