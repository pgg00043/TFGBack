import { Team } from 'src/team/domain/Team';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, OneToMany, JoinTable } from 'typeorm';
import { Stats } from 'src/stats/domain/Stat';
import { Competition } from 'src/competition/domain/Competition';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  imageUrl: string;

  @ManyToMany(() => Team, team => team.players, { eager: true })
  @JoinTable()
  teams: Team[];

  @OneToMany(() => Stats, stat => stat.user)
  stats: Stats[];
  
  @OneToMany(() => Competition, competition => competition.owner)
  competitions: Competition[];
  
  @OneToMany(() => Team, team => team.owner)
  ownedTeams: Team[];

}
