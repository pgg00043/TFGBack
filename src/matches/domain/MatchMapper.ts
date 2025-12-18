import { Match } from './Match';
import { MatchInputDto } from '../infrastructure/dto/MatchInputDto';
import { MatchOutputDto } from '../infrastructure/dto/MatchOutputDto';

export class MatchMapper {
  static toEntity(dto: MatchInputDto): Match {
    const m = new Match();

    m.date = dto.date;
    m.hour = dto.hour;
    m.location = dto.location;

    if (dto.homeTeamId) {
      m.homeTeam = { id: dto.homeTeamId } as any;
    }

    if (dto.awayTeamId) {
      m.awayTeam = { id: dto.awayTeamId } as any;
    }

    if (dto.competitionId) {
      m.competition = { id: dto.competitionId } as any;
    }

    return m;
  }

  static toOutput(entity: Match): MatchOutputDto {
    const dto = new MatchOutputDto();

    dto.id = entity.id;
    dto.date = entity.date;
    dto.hour = entity.hour;
    dto.location = entity.location;

    dto.homeTeamId = entity.homeTeam?.id;
    dto.awayTeamId = entity.awayTeam?.id;
    dto.competitionId = entity.competition?.id;

    return dto;
  }

  static toOutputList(entities: Match[]): MatchOutputDto[] {
    return entities.map(e => this.toOutput(e));
  }
}
