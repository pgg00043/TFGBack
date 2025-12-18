import { Team } from './Team';
import { TeamInputDto } from '../infrastructure/dto/TeamInputDto';
import { TeamOutputDto } from '../infrastructure/dto/TeamOutputDto';

export class TeamMapper {
  static toEntity(dto: TeamInputDto): Team {
    const entity = new Team();
    entity.name = dto.name;
    return entity;
  }

  static toOutput(entity: Team): TeamOutputDto {
    const dto = new TeamOutputDto();

    dto.id = entity.id;
    dto.name = entity.name;

    if (entity.players) {
      dto.players = entity.players.map(p => p.id);
    }

    if (entity.competitions) {
      dto.competitions = entity.competitions.map(c => c.id);
    }

    return dto;
  }

  static toOutputList(entities: Team[]): TeamOutputDto[] {
    return entities.map(e => this.toOutput(e));
  }
}
