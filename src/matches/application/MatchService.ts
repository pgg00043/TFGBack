import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from '../domain/Match';
import { MatchInputDto } from '../infrastructure/dto/MatchInputDto';
import { MatchUpdateInputDto } from '../infrastructure/dto/MatchUpdateInputDto';
import { MatchOutputDto } from '../infrastructure/dto/MatchOutputDto';
import { MatchMapper } from '../domain/MatchMapper';

@Injectable()
export class MatchesService {
    constructor(
        @InjectRepository(Match)
        private readonly matchRepository: Repository<Match>,
    ) {}

    async findOne(id: number): Promise<MatchOutputDto | null> {
        const match = await this.matchRepository.findOne({
            where: { id },
            relations: ['homeTeam', 'awayTeam', 'competition'],
        });

        return match ? MatchMapper.toOutput(match) : null;
    }

    async findAll(): Promise<MatchOutputDto[]> {
        const matches = await this.matchRepository.find({
            relations: ['homeTeam', 'awayTeam', 'competition'],
        });

        return MatchMapper.toOutputList(matches);
    }

    async createMatch(dto: MatchInputDto): Promise<MatchOutputDto> {
        const entity = MatchMapper.toEntity(dto);
        const saved = await this.matchRepository.save(entity);
        return MatchMapper.toOutput(saved);
    }

    async updateMatch(id: number, dto: MatchUpdateInputDto): Promise<MatchOutputDto | null> {
        const existing = await this.matchRepository.findOneBy({ id });
        if (!existing) throw new NotFoundException(`Match ${id} not found`);

        await this.matchRepository.update(id, dto);

        const updated = await this.matchRepository.findOne({
            where: { id },
            relations: ['homeTeam', 'awayTeam', 'competition'],
        });

        return MatchMapper.toOutput(updated!);
    }

    deleteMatch(id: number) {
        return this.matchRepository.delete(id);
    }

    async assignMatchToCompetition(matchId: number, competitionId: number): Promise<MatchOutputDto | null> {
        const match = await this.matchRepository.findOneBy({ id: matchId });
        if (!match) throw new NotFoundException(`Match ${matchId} not found`);

        match.competition = { id: competitionId } as any;
        const saved = await this.matchRepository.save(match);

        return MatchMapper.toOutput(saved);
    }

    async assignHomeTeamToMatch(matchId: number, teamId: number): Promise<MatchOutputDto | null> {
        const match = await this.matchRepository.findOneBy({ id: matchId });
        if (!match) throw new NotFoundException(`Match ${matchId} not found`);

        match.homeTeam = { id: teamId } as any;
        const saved = await this.matchRepository.save(match);

        return MatchMapper.toOutput(saved);
    }

    async assignAwayTeamToMatch(matchId: number, teamId: number): Promise<MatchOutputDto | null> {
        const match = await this.matchRepository.findOneBy({ id: matchId });
        if (!match) throw new NotFoundException(`Match ${matchId} not found`);

        match.awayTeam = { id: teamId } as any;
        const saved = await this.matchRepository.save(match);

        return MatchMapper.toOutput(saved);
    }

    async getMatchStats(matchId: number) {
        const match = await this.matchRepository.findOne({
            where: { id: matchId },
            relations: ['stats', 'stats.user'],
        });

        if (!match) throw new NotFoundException(`Match ${matchId} not found`);

        return match.stats;
    }
}
