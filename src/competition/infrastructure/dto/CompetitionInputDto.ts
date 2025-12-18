import { IsNotEmpty, IsString } from "class-validator";

export class CompetitionInputDto {
    @IsNotEmpty({ message: 'Competition name should not be empty' })
    @IsString({ message: 'Competition name must be a string' })
    name: string;

    @IsNotEmpty({ message: 'Category should not be empty' })
    @IsString({ message: 'Category must be a string' })
    category: string;

}