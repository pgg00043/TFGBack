import { Module } from '@nestjs/common';
import { UsersController } from './UserController';
import { UsersService } from '../application/UserService';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../domain/User';
import { Stats } from 'src/stats/domain/Stat';
import { Team } from 'src/team/domain/Team';

@Module({
    imports: [TypeOrmModule.forFeature([User,Stats, Team]),],
    controllers: [UsersController],
    providers: [UsersService]
})
export class UsersModule {}
