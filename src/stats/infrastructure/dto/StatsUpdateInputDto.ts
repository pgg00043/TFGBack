import { IsOptional, IsInt } from 'class-validator';

export class StatsUpdateInputDto {
  @IsOptional()
  @IsInt()
  points?: number;

  @IsOptional()
  @IsInt()
  rebounds?: number;

  @IsOptional()
  @IsInt()
  assists?: number;

  @IsOptional()
  @IsInt()
  steals?: number;

  @IsOptional()
  @IsInt()
  blocks?: number;

  @IsOptional()
  @IsInt()
  turnovers?: number;

  @IsOptional()
  @IsInt()
  fouls?: number;

  @IsOptional()
  @IsInt()
  minutesPlayed?: number;

}
