import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { UsersService } from '../application/UserService';
import { UserInputDto } from './dto/UserInputDto';
import { UserUpdateInputDto } from './dto/UserUpdateInputDto';
import { UserOutputDto } from './dto/UserOutputDto';
import { JwtAuthGuard } from 'src/auth/JwtAuthGuard';
import { Roles } from 'src/auth/RolesDecorator';
import { RolesGuard } from 'src/auth/RolesGuard';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    // PUBLIC
    @Get()
    findAll(): Promise<UserOutputDto[]> {
        return this.usersService.findAll();
    }

    // PUBLIC
    @Get(':id')
    findOne(
        @Param('id', ParseIntPipe) id: number
    ): Promise<UserOutputDto | null> {
        return this.usersService.findOne(id);
    }

    // PROTECTED — recommend only admin uses this
    @Roles('admin')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post()
    createUser(
        @Body() dto: UserInputDto
    ): Promise<UserOutputDto> {
        return this.usersService.createUser(dto);
    }

    // PROTECTED — the logged user or admin (roles later)
    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    updateUser(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UserUpdateInputDto,
    ): Promise<UserOutputDto | null> {
        return this.usersService.updateUser(id, dto);
    }

    // PROTECTED — admin only
    @Roles('admin')
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    deleteUser(
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.usersService.deleteUser(id);
    }

    // PROTECTED — admin only
    @Roles('admin')
    @UseGuards(JwtAuthGuard)
    @Patch(':userId/team/:teamId')
    assignTeamToUser(
        @Param('userId', ParseIntPipe) userId: number,
        @Param('teamId', ParseIntPipe) teamId: number
    ): Promise<UserOutputDto | null> {
        return this.usersService.assignTeamToUser(userId, teamId);
    }

    // PROTECTED — any authenticated user
    @UseGuards(JwtAuthGuard)
    @Patch(':userId/follow/:teamId')
    followTeam(
        @Param('userId', ParseIntPipe) userId: number,
        @Param('teamId', ParseIntPipe) teamId: number
    ): Promise<UserOutputDto | null> {
        return this.usersService.followTeam(userId, teamId);
    }

    // PUBLIC
    @Get(':id/stats')
    getUserStats(
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.usersService.getUserStats(id);
    }

    // PUBLIC
    @Get(':id/stats/summary')
    getUserStatsSummary(
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.usersService.getUserStatsSummary(id);
    }
}
