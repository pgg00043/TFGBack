import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from '../domain/Match';
import { MatchInputDto } from '../infrastructure/dto/MatchInputDto';
import { MatchUpdateInputDto } from '../infrastructure/dto/MatchUpdateInputDto';
import { MatchOutputDto } from '../infrastructure/dto/MatchOutputDto';
import { MatchMapper } from '../domain/MatchMapper';
import { Team } from 'src/team/domain/Team';
import { Stats } from 'src/stats/domain/Stat';

@Injectable()
export class MatchesService {
    constructor(
        @InjectRepository(Match)
        private readonly matchRepository: Repository<Match>,
        @InjectRepository(Team)
        private readonly teamRepository: Repository<Team>,
        @InjectRepository(Stats)
        private readonly statsRepository: Repository<Stats>,
    ) {}

    async findOne(id: number): Promise<MatchOutputDto | null> {
        const match = await this.matchRepository.findOne({
            where: { id },
            relations: ['homeTeam', 'awayTeam', 'competition', 'stats', 'homeTeam.players', 'awayTeam.players', 'stats.user', 'competition.owner'],
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
        const match = MatchMapper.toEntity(dto);

        const savedMatch = await this.matchRepository.save(match);

        const homeTeam = await this.teamRepository.findOne({
            where: { id: dto.homeTeamId },
            relations: ['players'],
        });

        const awayTeam = await this.teamRepository.findOne({
            where: { id: dto.awayTeamId },
            relations: ['players'],
        });

        if (!homeTeam || !awayTeam) {
            throw new Error('Equipos no encontrados');
        }

        const statsToCreate: Stats[] = [];

        for (const player of homeTeam.players) {
            statsToCreate.push(
                this.statsRepository.create({
                    match: savedMatch,
                    user: player,
                    points: 0,
                    rebounds: 0,
                    assists: 0,
                    steals: 0,
                    blocks: 0,
                    turnovers: 0,
                    fouls: 0,
                    minutesPlayed: 0,
                }),
            );
        }

        for (const player of awayTeam.players) {
            statsToCreate.push(
                this.statsRepository.create({
                    match: savedMatch,
                    user: player,
                    points: 0,
                    rebounds: 0,
                    assists: 0,
                    steals: 0,
                    blocks: 0,
                    turnovers: 0,
                    fouls: 0,
                    minutesPlayed: 0,
                }),
            );
        }

        await this.statsRepository.save(statsToCreate);

        const fullMatch = await this.matchRepository.findOne({
            where: { id: savedMatch.id },
            relations: {
                stats: {
                    user: {
                        teams: true,
                    },
                },
                homeTeam: true,
                awayTeam: true,
            },
        });

        return MatchMapper.toOutput(fullMatch!);
        }


    async updateMatch(
        matchId: number,
        dto: MatchUpdateInputDto,
        userId: number,
    ) {
        const match = await this.matchRepository.findOne({
            where: { id: matchId },
            relations: ['competition', 'competition.owner'],
        });

        if (!match) {
            throw new NotFoundException('Partido no encontrado');
        }

        if (match.competition.owner.id !== userId) {
            throw new ForbiddenException('No tienes permiso');
        }   
    
        Object.assign(match, dto);
        return this.matchRepository.save(match);
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
