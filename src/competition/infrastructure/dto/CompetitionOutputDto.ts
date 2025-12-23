export class CompetitionOutputDto {
  id: number;
  name: string;
  season: string;
  category: string;
  teamIds?: number[];
  matchIds?: number[];
}
