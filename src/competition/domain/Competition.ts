import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Team } from "src/team/domain/Team";
import { Match } from "src/matches/domain/Match";
import { User } from "src/users/domain/User";

@Entity()
export class Competition {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    category: string;

    @Column()
    imageUrl: string;

    @ManyToMany(() => Team, team => team.competitions,{eager: true})
    @JoinTable()
    teams: Team[];

    @OneToMany(() => Match, match => match.competition)
    matches: Match[];

    @ManyToOne(() => User, user => user.competitions, { nullable: false })
    @JoinColumn({ name: 'owner_id' })
    owner: User;
}