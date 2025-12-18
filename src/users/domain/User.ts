import { Team } from 'src/team/domain/Team';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, OneToMany } from 'typeorm';
import { Stats } from 'src/stats/domain/Stat';

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

  @Column()
  rol: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @ManyToOne(() => Team, team => team.players, { eager: true })
  team: Team;

  @ManyToMany(() => Team, team => team.followers, {eager: true})
  followedTeams: Team[];

  @OneToMany(() => Stats, stat => stat.user)
  stats: Stats[];
}
