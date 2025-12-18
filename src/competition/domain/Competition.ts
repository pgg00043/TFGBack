import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Team } from "src/team/domain/Team";

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
}