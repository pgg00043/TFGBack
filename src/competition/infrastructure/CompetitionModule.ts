import { Module } from '@nestjs/common';
import { CompetitionController } from './CompetitionController';
import { CompetitionService } from '../application/CompetitionService';
import { Competition } from '../domain/Competition';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Competition])],
  controllers: [CompetitionController],
  providers: [CompetitionService]
})
export class CompetitionModule {}
