import { Module } from '@nestjs/common';
import { CompetitionController } from './CompetitionController';
import { CompetitionService } from '../application/CompetitionService';
import { Competition } from '../domain/Competition';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from 'src/matches/domain/Match';

@Module({
  imports: [TypeOrmModule.forFeature([Competition, Match])],
  controllers: [CompetitionController],
  providers: [CompetitionService]
})
export class CompetitionModule {}
