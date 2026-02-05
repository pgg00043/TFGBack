import { CompetitionOutputDto } from "src/competition/infrastructure/dto/CompetitionOutputDto";
import { Stats } from "src/stats/domain/Stat";
import { TeamOutputDto } from "src/team/infrastructure/dto/TeamOutputDto";

export class MatchOutputDto {
  id: number;
  date: Date;
  hour?: string | null;
  location: string;
  scoreHome: number;
  scoreAway: number;
  homeTeam?: TeamOutputDto;
  awayTeam?: TeamOutputDto;
  competition: CompetitionOutputDto;
  stats?: Stats[];
}
