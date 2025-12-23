import {IsNotEmpty, IsOptional, IsString} from 'class-validator';

export class TeamInputDto {
    @IsNotEmpty({ message: 'Team name should not be empty' })
    @IsString({ message: 'Team name must be a string' })
    name: string;

    @IsOptional()
    played: number = 0;

    @IsOptional()
    won: number = 0;

    @IsOptional()
    lost: number = 0;

    @IsOptional()
    pointsFor: number = 0;

    @IsOptional()
    pointsAgainst: number = 0;
}