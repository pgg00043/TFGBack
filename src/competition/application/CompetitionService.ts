import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Competition } from '../domain/Competition';
import { CompetitionInputDto } from '../infrastructure/dto/CompetitionInputDto';
import { CompetitionUpdateInputDto } from '../infrastructure/dto/CompetitionUpdateInputDto';
import { CompetitionOutputDto } from '../infrastructure/dto/CompetitionOutputDto';
import { CompetitionMapper } from '../domain/CompetitionMapper';
import { TeamOutputDto } from 'src/team/infrastructure/dto/TeamOutputDto';
import { TeamMapper } from 'src/team/domain/TeamMapper';
import { MatchMapper } from 'src/matches/domain/MatchMapper';

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

    async createCompetition(dto: CompetitionInputDto, userId: number): Promise<CompetitionOutputDto> {
        const entity = CompetitionMapper.toEntity(dto);
        entity.owner = { id: userId } as any;
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

    async getTeamsInCompetition(competitionId: number): Promise<TeamOutputDto[]> {
        const competition = await this.competitionRepository.findOne({
            where: { id: competitionId },
            relations: ['teams'],
        });

        return TeamMapper.toOutputList(competition?.teams || []);
    }

    async getMatchesInCompetition(competitionId: number): Promise<any[]> {
        const competition = await this.competitionRepository.findOne({
            where: { id: competitionId },
            relations: ['matches'],
        });

        return MatchMapper.toOutputList(competition?.matches || []);
    }

    async addMatchToCompetition(competitionId: number, matchId: number): Promise<CompetitionOutputDto | null> {
        const competition = await this.competitionRepository.findOne({
            where: { id: competitionId },
            relations: ['matches'],
        });
        if (!competition) throw new NotFoundException(`Competition ${competitionId} not found`);
        const alreadyAdded = competition.matches.some(m => m.id === matchId);
        if (!alreadyAdded) {
            competition.matches.push({ id: matchId } as any);
        }
        const saved = await this.competitionRepository.save(competition);
        return CompetitionMapper.toOutput(saved);
    }

    async findByOwner(userId: number) {
        const competitions = await this.competitionRepository.find({
            where: {
            owner: { id: userId },
            },
            order: {
                id: 'DESC',
            },
        });

        return competitions.map(c =>
            CompetitionMapper.toOutput(c),
        );
    }
}
