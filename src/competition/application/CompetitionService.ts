import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Competition } from '../domain/Competition';
import { CompetitionInputDto } from '../infrastructure/dto/CompetitionInputDto';
import { CompetitionUpdateInputDto } from '../infrastructure/dto/CompetitionUpdateInputDto';
import { CompetitionOutputDto } from '../infrastructure/dto/CompetitionOutputDto';
import { CompetitionMapper } from '../domain/CompetitionMapper';

@Injectable()
export class CompetitionService {
    constructor(
        @InjectRepository(Competition)
        private readonly competitionRepository: Repository<Competition>,
    ) {}

    async findAll(): Promise<CompetitionOutputDto[]> {
        const competitions = await this.competitionRepository.find({
            relations: ['teams'],
        });

        return CompetitionMapper.toOutputList(competitions);
    }

    async findOne(id: number): Promise<CompetitionOutputDto | null> {
        const competition = await this.competitionRepository.findOne({
            where: { id },
            relations: ['teams'],
        });

        return competition ? CompetitionMapper.toOutput(competition) : null;
    }

    async createCompetition(dto: CompetitionInputDto): Promise<CompetitionOutputDto> {
        const entity = CompetitionMapper.toEntity(dto);
        const saved = await this.competitionRepository.save(entity);
        return CompetitionMapper.toOutput(saved);
    }

    async updateCompetition(id: number, dto: CompetitionUpdateInputDto): Promise<CompetitionOutputDto | null> {
        const existing = await this.competitionRepository.findOneBy({ id });
        if (!existing) throw new NotFoundException(`Competition ${id} not found`);

        await this.competitionRepository.update(id, dto);
        const updated = await this.competitionRepository.findOne({
            where: { id },
            relations: ['teams'],
        });

        return CompetitionMapper.toOutput(updated!);
    }

    async deleteCompetition(id: number) {
        return this.competitionRepository.delete(id);
    }

    async addTeamToCompetition(competitionId: number, teamId: number): Promise<CompetitionOutputDto | null> {
        const competition = await this.competitionRepository.findOne({
            where: { id: competitionId },
            relations: ['teams'],
        });

        if (!competition) throw new NotFoundException(`Competition ${competitionId} not found`);

        const alreadyAdded = competition.teams.some(t => t.id === teamId);
        if (!alreadyAdded) {
            competition.teams.push({ id: teamId } as any);
        }

        const saved = await this.competitionRepository.save(competition);
        return CompetitionMapper.toOutput(saved);
    }

    async removeTeamFromCompetition(competitionId: number, teamId: number): Promise<CompetitionOutputDto | null> {
        const competition = await this.competitionRepository.findOne({
            where: { id: competitionId },
            relations: ['teams'],
        });

        if (!competition) throw new NotFoundException(`Competition ${competitionId} not found`);

        competition.teams = competition.teams.filter(team => team.id !== teamId);

        const saved = await this.competitionRepository.save(competition);
        return CompetitionMapper.toOutput(saved);
    }
}
