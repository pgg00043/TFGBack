export class MatchOutputDto {
  id: number;
  date: Date;
  hour: string;
  location: string;
  scoreHome: number;
  scoreAway: number;
  homeTeamId?: number;
  awayTeamId?: number;
  competitionId?: number;
}
