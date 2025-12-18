import { Module } from '@nestjs/common';
import { TeamController } from './TeamController';
import { TeamService } from '../application/TeamService';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from '../domain/Team';

@Module({
  imports: [TypeOrmModule.forFeature([Team])],
  controllers: [TeamController],
  providers: [TeamService]
})
export class TeamModule {}
