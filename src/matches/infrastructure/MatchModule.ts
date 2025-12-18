import { Module } from '@nestjs/common';
import { MatchesController } from './MatchController';
import { MatchesService } from '../application/MatchService';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from '../domain/Match';

@Module({
  imports: [TypeOrmModule.forFeature([Match])],
  controllers: [MatchesController],
  providers: [MatchesService]
})
export class MatchesModule {}
