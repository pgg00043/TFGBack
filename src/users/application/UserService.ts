import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../domain/User';
import { UserInputDto } from '../infrastructure/dto/UserInputDto';
import { UserUpdateInputDto } from '../infrastructure/dto/UserUpdateInputDto';
import { UserOutputDto } from '../infrastructure/dto/UserOutputDto';
import { Stats } from 'src/stats/domain/Stat';
import { UserMapper } from '../domain/UserMapper';
import { Team } from 'src/team/domain/Team';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(Stats)
        private readonly statsRepository: Repository<Stats>,

        @InjectRepository(Team)
        private readonly teamRepository: Repository<Team>,
    ) {}

    async findAll(): Promise<UserOutputDto[]> {
        const users = await this.userRepository.find({
            relations: ['teams', 'ownedTeams'],
        });

        return UserMapper.toOutputList(users);
    }

    async findOne(id: number): Promise<UserOutputDto | null> {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: ['teams', 'ownedTeams'],
        });
        return user ? UserMapper.toOutput(user) : null;
    }

    async createUser(dto: UserInputDto): Promise<UserOutputDto> {
        const hashedPassword = await bcrypt.hash(dto.password, 10);

        const entity = UserMapper.toEntity({
        ...dto,
        password: hashedPassword,
        });

        const saved = await this.userRepository.save(entity);
        return UserMapper.toOutput(saved);
    }

     async updateUser(id: number, dto: UserUpdateInputDto): Promise<UserOutputDto | null> {
        const exists = await this.userRepository.findOneBy({ id });
        if (!exists) throw new NotFoundException(`User ${id} not found`);

        const toUpdate: UserUpdateInputDto = { ...dto };

        if (toUpdate.password) {
        toUpdate.password = await bcrypt.hash(toUpdate.password, 10);
        }

        await this.userRepository.update(id, toUpdate);

        const updated = await this.userRepository.findOne({
        where: { id },
        relations: ['teams', 'ownedTeams'],
        });

        return UserMapper.toOutput(updated!);
    }

    deleteUser(id: number) {
        return this.userRepository.delete(id);
    }

    async assignTeamToUser(targetUserId: number, teamId: number, requesterUserId: number,): Promise<UserOutputDto> {
        const team = await this.teamRepository.findOne({
            where: { id: teamId },
            relations: ['owner'],
        });
        
        if (!team) {
            throw new NotFoundException(`Team ${teamId} not found`);
        }

        if (team.owner.id !== requesterUserId) {
            throw new ForbiddenException(
                'Only the team owner can add users to the team',
            );
        }

        const user = await this.userRepository.findOne({
            where: { id: targetUserId },
            relations: ['teams'],
        });
        if (!user) {
            throw new NotFoundException(`User ${targetUserId} not found`);
        }

        if (!user.teams.some(t => t.id === team.id)) {
            user.teams.push(team);
            await this.userRepository.save(user);
        }

        return UserMapper.toOutput(user);
    }

    async getUserStats(userId: number) {
        const stats = await this.statsRepository.find({
            where: { user: { id: userId } },
            relations: ['match'],
        });

        return stats.map(stat => ({
            ...stat,
            matchId: stat.match?.id,
        }));
    }

    async searchUsersByName(name: string): Promise<UserOutputDto[]> {
        const users = await this.userRepository.find({
            where: { name: name },
            relations: ['teams', 'ownedTeams'],
        });
        return UserMapper.toOutputList(users);
    }

    async getUserStatsSummary(userId: number) {
        const stats = await this.statsRepository.find({
            where: { user: { id: userId } },
        });

        if (stats.length === 0) {
            return {
                gamesPlayed: 0,
                avgPoints: 0,
                avgRebounds: 0,
                avgAssists: 0,
            };
        }

        const gamesPlayed = stats.length;

        const totalPoints = stats.reduce((sum, s) => sum + (s.points ?? 0), 0);
        const totalRebounds = stats.reduce((sum, s) => sum + (s.rebounds ?? 0), 0);
        const totalAssists = stats.reduce((sum, s) => sum + (s.assists ?? 0), 0);

        return {
            gamesPlayed,
            avgPoints: +(totalPoints / gamesPlayed).toFixed(2),
            avgRebounds: +(totalRebounds / gamesPlayed).toFixed(2),
            avgAssists: +(totalAssists / gamesPlayed).toFixed(2),
        };
    }

    async updateImage(userId: number, imageUrl: string) {
        await this.userRepository.update(userId, { imageUrl });
    }

    async searchUsersByEmail(email: string): Promise<UserOutputDto> {
        const user = await this.userRepository.findOne({
            where: { email },
        });
        if (!user) {
            throw new NotFoundException(`User with email ${email} not found`);
        }
        return UserMapper.toOutput(user);
    }
}