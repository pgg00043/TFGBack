import { Stats } from './Stat';
import { StatsInputDto } from '../infrastructure/dto/StatsInputDto';
import { StatsOutputDto } from '../infrastructure/dto/StatsOutputDto';

export class StatsMapper {

  static toEntity(dto: StatsInputDto): Stats {
    const s = new Stats();

    s.points = dto.points;
    s.rebounds = dto.rebounds;
    s.assists = dto.assists;
    s.steals = dto.steals;
    s.blocks = dto.blocks;
    s.turnovers = dto.turnovers;
    s.fouls = dto.fouls;
    s.minutesPlayed = dto.minutesPlayed;

    s.user = { id: dto.userId } as any;
    s.match = { id: dto.matchId } as any;

    return s;
  }

  static toOutput(entity: Stats): StatsOutputDto {
    const dto = new StatsOutputDto();

    dto.id = entity.id;
    dto.points = entity.points;
    dto.rebounds = entity.rebounds;
    dto.assists = entity.assists;
    dto.steals = entity.steals;
    dto.blocks = entity.blocks;
    dto.turnovers = entity.turnovers;
    dto.fouls = entity.fouls;
    dto.minutesPlayed = entity.minutesPlayed;

    dto.userId = entity.user?.id;
    dto.matchId = entity.match?.id;

    return dto;
  }

  static toOutputList(entities: Stats[]): StatsOutputDto[] {
    return entities.map(s => this.toOutput(s));
  }
}
