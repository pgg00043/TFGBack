import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Team } from "src/team/domain/Team";
import { Match } from "src/matches/domain/Match";

@Entity()
export class Competition {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    category: string;

    @ManyToMany(() => Team, team => team.competitions,{eager: true})
    @JoinTable()
    teams: Team[];

    @OneToMany(() => Match, match => match.competition)
    matches: Match[];
}