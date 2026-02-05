import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UserInputDto {
    @IsNotEmpty({ message: 'Email should not be empty' })
    @IsString({ message: 'Email must be a string' })
    username: string;

    @IsNotEmpty({ message: 'Password should not be empty' })
    @IsString({ message: 'Password must be a string' })
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;

    @IsNotEmpty({ message: 'Name should not be empty' })
    @IsString({ message: 'Name must be a string' })
    name: string;

    @IsNotEmpty({ message: 'Surname should not be empty' })
    @IsString({ message: 'Surname must be a string' })
    surname: string;

    @IsNotEmpty({ message: 'Email should not be empty' })
    @IsString({ message: 'Email must be a string' })
    @IsEmail({}, { message: 'Email must be a valid email address' })
    email: string;
    
}
