import { IsOptional, IsString, IsInt } from 'class-validator';

export class MatchUpdateInputDto {
  @IsOptional()
  @IsString()
  date?: string;

  @IsOptional()
  @IsString()
  hour?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsInt()
  homeTeamId?: number;

  @IsOptional()
  @IsInt()
  awayTeamId?: number;

  @IsOptional()
  @IsInt()
  competitionId?: number;
}
