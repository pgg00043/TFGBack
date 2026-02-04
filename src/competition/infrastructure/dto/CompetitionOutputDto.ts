export class CompetitionOutputDto {
  id: number;
  name: string;
  category: string;
  teamIds?: number[];
  matchIds?: number[];
  ownerId: number;
  imageUrl?: string;
}
