import { Competition } from './Competition';
import { CompetitionInputDto } from '../infrastructure/dto/CompetitionInputDto';
import { CompetitionOutputDto } from '../infrastructure/dto/CompetitionOutputDto';

export class CompetitionMapper {
  static toEntity(dto: CompetitionInputDto): Competition {
    const c = new Competition();
    c.name = dto.name;
    c.category = dto.category;
    return c;
  }

  static toOutput(entity: Competition): CompetitionOutputDto {
    const dto = new CompetitionOutputDto();

    dto.id = entity.id;
    dto.name = entity.name;
    dto.category = entity.category;

    if (entity.teams) {
      dto.teamIds = entity.teams.map(t => t.id);
    }

    return dto;
  }

  static toOutputList(entities: Competition[]): CompetitionOutputDto[] {
    return entities.map(e => this.toOutput(e));
  }
}
