import { Module } from '@nestjs/common';
import { StatsController } from './StatsController';
import { StatsService } from '../application/StatsService';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stats } from '../domain/Stat';
import { Match } from 'src/matches/domain/Match';
import { User } from 'src/users/domain/User';

@Module({
  imports: [TypeOrmModule.forFeature([Stats, User, Match])],
  controllers: [StatsController],
  providers: [StatsService]
})
export class StatsModule {}
