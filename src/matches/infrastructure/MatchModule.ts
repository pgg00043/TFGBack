import { Module } from '@nestjs/common';
import { MatchesController } from './MatchController';
import { MatchesService } from '../application/MatchService';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from '../domain/Match';
import { Stats } from 'src/stats/domain/Stat';
import { Team } from 'src/team/domain/Team';

@Module({
  imports: [TypeOrmModule.forFeature([Match, Stats, Team])],
  controllers: [MatchesController],
  providers: [MatchesService]
})
export class MatchesModule {}
