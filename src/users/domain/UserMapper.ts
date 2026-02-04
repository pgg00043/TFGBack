import { UserInputDto } from '../infrastructure/dto/UserInputDto';
import { UserOutputDto } from '../infrastructure/dto/UserOutputDto';
import { User } from './User';

export class UserMapper {
  static toEntity(dto: UserInputDto): User {
    const user = new User();

    user.username = dto.username;
    user.password = dto.password; 
    user.name = dto.name;
    user.surname = dto.surname;
    user.email = dto.email;

    return user;
  }

  static toOutput(entity: User): UserOutputDto {
    const dto = new UserOutputDto();

    dto.id = entity.id;
    dto.username = entity.username;
    dto.name = entity.name;
    dto.surname = entity.surname;
    dto.email = entity.email;
    dto.imageUrl = entity.imageUrl;
    return dto;
  }

  static toOutputList(entities: User[]): UserOutputDto[] {
    return entities.map(e => this.toOutput(e));
  }

}
