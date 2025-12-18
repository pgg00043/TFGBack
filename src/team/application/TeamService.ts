import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from '../domain/Team';
import { TeamInputDto } from '../infrastructure/dto/TeamInputDto';
import { TeamUpdateInputDto } from '../infrastructure/dto/TeamUpdateInputDto';
import { TeamOutputDto } from '../infrastructure/dto/TeamOutputDto';
import { TeamMapper } from '../domain/TeamMapper';

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

    async createTeam(dto: TeamInputDto): Promise<TeamOutputDto> {
        const entity = TeamMapper.toEntity(dto);
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
}
