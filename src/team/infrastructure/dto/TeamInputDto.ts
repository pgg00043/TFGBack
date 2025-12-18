import {IsNotEmpty, IsString} from 'class-validator';

export class TeamInputDto {
    @IsNotEmpty({ message: 'Team name should not be empty' })
    @IsString({ message: 'Team name must be a string' })
    name: string;
}