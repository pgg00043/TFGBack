import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from '../domain/Team';
import { TeamInputDto } from '../infrastructure/dto/TeamInputDto';
import { TeamUpdateInputDto } from '../infrastructure/dto/TeamUpdateInputDto';
import { TeamOutputDto } from '../infrastructure/dto/TeamOutputDto';
import { TeamMapper } from '../domain/TeamMapper';
import { UserOutputDto } from 'src/users/infrastructure/dto/UserOutputDto';

@Injectable()
export class TeamService {
    constructor(
        @InjectRepository(Team)
        private readonly teamRepository: Repository<Team>,
    ) {}

    async findOne(id: number): Promise<TeamOutputDto | null> {
        const team = await this.teamRepository.findOne({
            where: { id },
            relations: ['players', 'competitions'],
        });

        return team ? TeamMapper.toOutput(team) : null;
    }

    async findAll(): Promise<TeamOutputDto[]> {
        const teams = await this.teamRepository.find({
            relations: ['players', 'competitions'],
        });

        return TeamMapper.toOutputList(teams);
    }

    async createTeam(dto: TeamInputDto, ownerId: number): Promise<TeamOutputDto> {
        const entity = TeamMapper.toEntity(dto);
        entity.owner = { id: ownerId } as any;

        const saved = await this.teamRepository.save(entity);
        return TeamMapper.toOutput(saved);
    }


    async updateTeam(id: number, dto: TeamUpdateInputDto): Promise<TeamOutputDto | null> {
        const exists = await this.teamRepository.findOneBy({ id });
        if (!exists) throw new NotFoundException(`Team ${id} not found`);

        await this.teamRepository.update(id, dto);

        const updated = await this.teamRepository.findOne({
            where: { id },
            relations: ['players', 'competitions'],
        });

        return TeamMapper.toOutput(updated!);
    }
    
    deleteTeam(id: number) {
        return this.teamRepository.delete(id);
    }
    
    async getAllPlayersOfTeam(teamId: number): Promise<UserOutputDto[]> {
        const team = await this.teamRepository.findOne({
            where: { id: teamId },
            relations: ['players'],
        });
        if (!team) throw new NotFoundException(`Team ${teamId} not found`);

        return team.players;
    }

    async getMyTeams(userId: number): Promise<TeamOutputDto[]> {
    const teams = await this.teamRepository.find({
        where: {
        owner: { id: userId },
        },
    });

    return TeamMapper.toOutputList(teams);
    }
}

