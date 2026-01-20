import { IsOptional, IsString } from 'class-validator';

export class CompetitionUpdateInputDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  category?: string;
}
