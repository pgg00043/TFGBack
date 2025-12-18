import { IsOptional, IsString } from 'class-validator';

export class TeamUpdateInputDto {
  @IsOptional()
  @IsString()
  name?: string;
}
