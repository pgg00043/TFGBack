import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Stats } from '../domain/Stat';
import { Repository } from 'typeorm';
import { User } from 'src/users/domain/User';
import { Match } from 'src/matches/domain/Match';
import { StatsInputDto } from '../infrastructure/dto/StatsInputDto';
import { StatsUpdateInputDto } from '../infrastructure/dto/StatsUpdateInputDto';
import { StatsOutputDto } from '../infrastructure/dto/StatsOutputDto';
import { StatsMapper } from '../domain/StatsMapper';

@Injectable()
export class StatsService {
    constructor(
        @InjectRepository(Stats)
        private readonly statsRepository: Repository<Stats>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(Match)
        private readonly matchRepository: Repository<Match>,
    ) {}

    async findOne(id: number): Promise<StatsOutputDto | null> {
        const stats = await this.statsRepository.findOne({
            where: { id },
            relations: ['user', 'match'],
        });

        return stats ? StatsMapper.toOutput(stats) : null;
    }

    async findAll(): Promise<StatsOutputDto[]> {
        const stats = await this.statsRepository.find({
            relations: ['user', 'match'],
        });

        return StatsMapper.toOutputList(stats);
    }

    async createStats(dto: StatsInputDto): Promise<StatsOutputDto> {
        const entity = StatsMapper.toEntity(dto);
        const saved = await this.statsRepository.save(entity);
        return StatsMapper.toOutput(saved);
    }

    async updateStats(id: number, dto: StatsUpdateInputDto): Promise<StatsOutputDto | null> {
        const exists = await this.statsRepository.findOneBy({ id });
        if (!exists) throw new NotFoundException(`Stats ${id} not found`);

        await this.statsRepository.update(id, dto);

        const updated = await this.statsRepository.findOne({
            where: { id },
            relations: ['user', 'match'],
        });

        return StatsMapper.toOutput(updated!);
    }

    deleteStats(id: number) {
        return this.statsRepository.delete(id);
    }

    async assignPlayerToStats(statsId: number, playerId: number): Promise<StatsOutputDto | null> {
        const stats = await this.statsRepository.findOneBy({ id: statsId });
        if (!stats) throw new NotFoundException(`Stats ${statsId} not found`);

        const user = await this.userRepository.findOneBy({ id: playerId });
        if (!user) throw new NotFoundException(`User ${playerId} not found`);

        stats.user = user;
        const saved = await this.statsRepository.save(stats);

        return StatsMapper.toOutput(saved);
    }

    async assignMatchToStats(statsId: number, matchId: number): Promise<StatsOutputDto | null> {
        const stats = await this.statsRepository.findOneBy({ id: statsId });
        if (!stats) throw new NotFoundException(`Stats ${statsId} not found`);

        const match = await this.matchRepository.findOneBy({ id: matchId });
        if (!match) throw new NotFoundException(`Match ${matchId} not found`);

        stats.match = match;
        const saved = await this.statsRepository.save(stats);

        return StatsMapper.toOutput(saved);
    }
}
