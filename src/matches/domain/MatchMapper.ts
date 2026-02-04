import { Match } from './Match';
import { MatchInputDto } from '../infrastructure/dto/MatchInputDto';
import { MatchOutputDto } from '../infrastructure/dto/MatchOutputDto';
import { TeamMapper } from 'src/team/domain/TeamMapper';
import { CompetitionMapper } from 'src/competition/domain/CompetitionMapper';

export class MatchMapper {
  static toEntity(dto: MatchInputDto): Match {
    const m = new Match();

    m.date = dto.date;
    m.hour = dto.hour;
    m.location = dto.location;
    m.scoreAway = dto.scoreAway ?? 0;
    m.scoreHome = dto.scoreHome ?? 0;

    if (dto.homeTeamId) {
      m.homeTeam = { 
        id: dto.homeTeamId,
        players: m.homeTeam.players.map(player => ({ 
          id: player.id,
          name: player.name,
          surname: player.surname,
         })),
      } as any;
    }

    if (dto.awayTeamId) {
      m.awayTeam = { id: dto.awayTeamId,
        players: m.awayTeam.players.map(player => ({ 
          id: player.id,
          name: player.name,
          surname: player.surname,
         })),
      } as any;
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

    dto.homeTeam = TeamMapper.toOutput(entity.homeTeam);
    dto.awayTeam = TeamMapper.toOutput(entity.awayTeam);
    dto.competition = CompetitionMapper.toOutput(entity.competition);

    dto.scoreHome = entity.scoreHome;
    dto.scoreAway = entity.scoreAway;

    dto.stats = entity.stats;

    

    return dto;
  }


  static toOutputList(entities: Match[]): MatchOutputDto[] {
    return entities.map(e => this.toOutput(e));
  }
}
