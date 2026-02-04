import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany, JoinTable, ManyToOne, JoinColumn } from 'typeorm';
import { User } from 'src/users/domain/User';
import { Competition } from 'src/competition/domain/Competition';

@Entity()
export class Team {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToMany(() => User, user => user.teams)
    players: User[];
    
    @ManyToMany(() => Competition, competition => competition.teams)
    competitions: Competition[];

    @Column()
    played: number = 0;

    @Column()
    won: number = 0;

    @Column()
    lost: number = 0;

    @Column()
    pointsFor: number = 0;

    @Column()
    pointsAgainst: number = 0;

    @Column({ nullable: true })
    imageUrl?: string;

    @ManyToOne(() => User, user => user.ownedTeams, { nullable: false })
    @JoinColumn({ name: 'owner_id' })
    owner: User;

}