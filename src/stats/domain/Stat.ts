import { Match } from 'src/matches/domain/Match';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from 'src/users/domain/User';


@Entity()
export class Stats {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    points: number;

    @Column()
    rebounds: number;

    @Column()
    assists: number;

    @Column()
    steals: number;

    @Column()
    blocks: number;

    @Column()
    turnovers: number;

    @Column()
    fouls: number;

    @Column()
    minutesPlayed: number;

    @ManyToOne(() => User, user => user.stats)
    user: User;

    @ManyToOne(() => Match, match => match.stats)
    match: Match;
}