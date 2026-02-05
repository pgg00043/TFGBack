export class MatchInputDto {
  date: Date;
  hour?: string | null;
  location: string;
  scoreHome?: number = 0;
  scoreAway?: number = 0;
  homeTeamId?: number;
  awayTeamId?: number;
  competitionId?: number;
}
