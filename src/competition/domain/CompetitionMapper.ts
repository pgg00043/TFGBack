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
    return {
      id: entity.id,
      name: entity.name,
      category: entity.category,
      teamIds: entity.teams?.map(t => t.id),
      ownerId: entity.owner?.id ?? 0,
      imageUrl: entity.imageUrl,
    };
  }


  static toOutputList(entities: Competition[]): CompetitionOutputDto[] {
    return entities.map(e => this.toOutput(e));
  }
}
