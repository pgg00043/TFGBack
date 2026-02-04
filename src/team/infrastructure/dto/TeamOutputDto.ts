import { User } from "src/users/domain/User";
import { UserOutputDto } from "src/users/infrastructure/dto/UserOutputDto";

export class TeamOutputDto {
  id: number;
  name: string;
  players?: UserOutputDto[];
  competitions?: number[];
  played: number;
  won: number;
  lost: number;
  pointsFor: number;
  pointsAgainst: number;
  imageUrl?: string;
  owner: UserOutputDto;
}
