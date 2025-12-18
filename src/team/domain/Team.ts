import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany, JoinTable } from 'typeorm';
import { User } from 'src/users/domain/User';
import { Competition } from 'src/competition/domain/Competition';

@Entity()
export class Team {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(() => User, user => user.team)
    players: User[];

    @ManyToMany(() => User, user => user.followedTeams)
    @JoinTable()
    followers: User[];
    
    @ManyToMany(() => Competition, competition => competition.teams)
    competitions: Competition[];

}