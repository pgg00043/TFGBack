import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
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
import { Match } from 'src/matches/domain/Match';

type GeneratedMatch = {
    homeTeamId: number;
    awayTeamId: number;
    round: number;
};

function generateCalendar(teamIds: number[]): GeneratedMatch[][] {
    const teams = [...teamIds];

    if (teams.length % 2 !== 0) {
        teams.push(-1);
    }

    const totalTeams = teams.length;
    const rounds = totalTeams - 1;
    const matchesPerRound = totalTeams / 2;

    const calendar: GeneratedMatch[][] = [];

    for (let round = 0; round < rounds; round++) {
        const roundMatches: GeneratedMatch[] = [];

        for (let i = 0; i < matchesPerRound; i++) {
        const home = teams[i];
        const away = teams[totalTeams - 1 - i];

        // Ignoramos los partidos contra el equipo ficticio
        if (home !== -1 && away !== -1) {
            roundMatches.push({
            homeTeamId: home,
            awayTeamId: away,
            round: round + 1,
            });
        }
        }

        calendar.push(roundMatches);

        // Rotación manteniendo fijo el primer equipo
        const last = teams.pop();
        if (last !== undefined) {
        teams.splice(1, 0, last);
        }
    }

    return calendar;
}

@Injectable()
export class CompetitionService {
    constructor(
        @InjectRepository(Competition)
        private readonly competitionRepository: Repository<Competition>,
        @InjectRepository(Match)
        private readonly matchRepository: Repository<Match>,
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
            relations: ['teams', 'owner'],
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

    async addTeamToCompetition(competitionId: number, teamId: number, requesterUserId: number): Promise<CompetitionOutputDto | null> {
        const competition = await this.competitionRepository.findOne({
            where: { id: competitionId },
            relations: ['teams', 'owner'],
        });

        if (!competition) throw new NotFoundException(`Competition ${competitionId} not found`);

        if(competition.owner.id != requesterUserId){
            throw new ForbiddenException('Only the team owner can add users to the team',);
        }

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

    async generateMatches(competitionId: number): Promise<void> {
        const competition = await this.competitionRepository.findOne({
            where: { id: competitionId },
            relations: ['teams'],
        });

        if (!competition) {
            throw new NotFoundException('Competición no encontrada');
        }

        if (!competition.teams || competition.teams.length < 2) {
            throw new BadRequestException('No hay suficientes equipos');
        }

        await this.matchRepository.delete({
            competition: { id: competitionId },
        });

        const teamIds = competition.teams.map(t => t.id);
        const calendar = generateCalendar(teamIds);

        /* 🟢 PASO 3: GUARDAR NUEVOS PARTIDOS */
        for (const round of calendar) {
            for (const match of round) {
            const newMatch = this.matchRepository.create({
                competition: { id: competitionId },
                homeTeam: { id: match.homeTeamId },
                awayTeam: { id: match.awayTeamId },
                scoreHome: 0,
                scoreAway: 0,
            });

            await this.matchRepository.save(newMatch);
            }
        }
    }

    async updateImage(competitionId: number, imageUrl: string) {
        await this.competitionRepository.update(competitionId, { imageUrl });
    }
}
