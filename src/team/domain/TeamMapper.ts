import { Team } from './Team';
import { TeamInputDto } from '../infrastructure/dto/TeamInputDto';
import { TeamOutputDto } from '../infrastructure/dto/TeamOutputDto';

export class TeamMapper {
  static toEntity(dto: TeamInputDto): Team {
    const entity = new Team();
    entity.name = dto.name;
    entity.played = dto.played ?? 0;
    entity.won = dto.won ?? 0;
    entity.lost = dto.lost ?? 0;
    entity.pointsFor = dto.pointsFor ?? 0;
    entity.pointsAgainst = dto.pointsAgainst ?? 0;
    return entity;
  }

  static toOutput(entity: Team): TeamOutputDto {
    const dto = new TeamOutputDto();

    dto.id = entity.id;
    dto.name = entity.name;
    dto.played = entity.played;
    dto.won = entity.won;
    dto.lost = entity.lost;
    dto.pointsFor = entity.pointsFor;
    dto.pointsAgainst = entity.pointsAgainst;
    dto.imageUrl = entity.imageUrl;

    if (entity.players) {
      dto.players = entity.players.map(p => ({
        id: p.id,
        name: p.name,
        surname: p.surname,
        username: p.username,
        email: p.email,
        rol: p.rol
      }));
    }

    if (entity.competitions) {
      dto.competitions = entity.competitions.map(c => c.id);
    }

    if (entity.owner) {
      dto.owner = entity.owner;
    }

    return dto;
  }

  static toOutputList(entities: Team[]): TeamOutputDto[] {
    return entities.map(e => this.toOutput(e));
  }
}
