import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { UsersService } from '../application/UserService';
import { UserInputDto } from './dto/UserInputDto';
import { UserUpdateInputDto } from './dto/UserUpdateInputDto';
import { UserOutputDto } from './dto/UserOutputDto';
import { JwtAuthGuard } from 'src/auth/JwtAuthGuard';
import { RolesGuard } from 'src/auth/RolesGuard';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    findAll(): Promise<UserOutputDto[]> {
        return this.usersService.findAll();
    }

    @Get(':id')
    findOne(
        @Param('id', ParseIntPipe) id: number
    ): Promise<UserOutputDto | null> {
        return this.usersService.findOne(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post()
    createUser(
        @Body() dto: UserInputDto
    ): Promise<UserOutputDto> {
        return this.usersService.createUser(dto);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    updateUser(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UserUpdateInputDto,
    ): Promise<UserOutputDto | null> {
        return this.usersService.updateUser(id, dto);
    }

    // PROTECTED — admin only
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    deleteUser(
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.usersService.deleteUser(id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':userId/team/:teamId')
    assignTeamToUser(
        @Param('userId', ParseIntPipe) userId: number,
        @Param('teamId', ParseIntPipe) teamId: number,
        @Req() req: Request,
    ): Promise<UserOutputDto | null> {
        const requester = req.user as {userId: number};
        return this.usersService.assignTeamToUser(userId, teamId, requester.userId);
    }

    
    @Get(':id/stats')
    getUserStats(
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.usersService.getUserStats(id);
    }

    @Get(':id/stats/summary')
    getUserStatsSummary(
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.usersService.getUserStatsSummary(id);
    }
}
