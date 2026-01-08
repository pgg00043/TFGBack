import { Team } from "src/team/domain/Team";
import { TeamOutputDto } from "src/team/infrastructure/dto/TeamOutputDto";

export class MatchOutputDto {
  id: number;
  date: Date;
  hour: string;
  location: string;
  scoreHome: number;
  scoreAway: number;
  homeTeam?: TeamOutputDto;
  awayTeam?: TeamOutputDto;
  competitionId?: number;
  Stats?: any[];
}
