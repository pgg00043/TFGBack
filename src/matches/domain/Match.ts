import { Stats } from "src/stats/domain/Stat";
import { Competition } from "src/competition/domain/Competition";
import { Team } from "src/team/domain/Team";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Match{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    date: Date;

    @Column({type : 'time', nullable: true})
    hour?: string | null;

    @Column()
    location: string;

    @Column()
    scoreHome: number = 0;

    @Column()
    scoreAway: number = 0;

    @ManyToOne(() => Team, {eager: true})
    homeTeam: Team;

    @ManyToOne(() => Team, {eager: true})
    awayTeam: Team;

    @ManyToOne(() => Competition, {eager: true})
    competition: Competition;

    @OneToMany(() => Stats, stats => stats.match)
    stats: Stats[];

}