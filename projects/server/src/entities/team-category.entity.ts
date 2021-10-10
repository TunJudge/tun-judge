import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Team } from './team.entity';

@Entity()
export class TeamCategory {
  @PrimaryGeneratedColumn({ comment: 'Team Category ID' })
  id: number;

  @Column({ comment: 'Team Category name' })
  name: string;

  @Column({ comment: 'Team Category scoreboard sort index', unique: true })
  sortOrder: number;

  @Column({ comment: 'Background color in the scoreboard', default: '#ffffff' })
  color: string;

  @Column({
    comment: 'Whether the teams in this category are visible in the scoreboard',
    default: true,
  })
  visible: boolean;

  @OneToMany(() => Team, (team) => team.category)
  teams: Team[];
}
