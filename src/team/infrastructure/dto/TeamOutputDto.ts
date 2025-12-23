export class TeamOutputDto {
  id: number;
  name: string;
  players?: number[];
  competitions?: number[];
  played: number;
  won: number;
  lost: number;
  pointsFor: number;
  pointsAgainst: number;
}
