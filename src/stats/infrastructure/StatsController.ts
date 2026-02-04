import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { StatsService } from '../application/StatsService';
import { StatsInputDto } from './dto/StatsInputDto';
import { StatsUpdateInputDto } from './dto/StatsUpdateInputDto';
import { StatsOutputDto } from './dto/StatsOutputDto';
import { JwtAuthGuard } from 'src/auth/JwtAuthGuard';
import { Roles } from 'src/auth/RolesDecorator';
import { RolesGuard } from 'src/auth/RolesGuard';

@Controller('stats')
export class StatsController {
    constructor(private readonly statsService: StatsService) {}

    @Get()
    findAll(): Promise<StatsOutputDto[]> {
        return this.statsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number): Promise<StatsOutputDto | null> {
        return this.statsService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    createStats(
        @Body() dto: StatsInputDto
    ): Promise<StatsOutputDto> {
        return this.statsService.createStats(dto);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    updateStats(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: StatsUpdateInputDto,
    ): Promise<StatsOutputDto | null> {
        return this.statsService.updateStats(id, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    deleteStats(@Param('id', ParseIntPipe) id: number) {
        return this.statsService.deleteStats(id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id/assign-player/:playerId')
    assignPlayerToStats(
        @Param('id', ParseIntPipe) statsId: number,
        @Param('playerId', ParseIntPipe) playerId: number,
    ): Promise<StatsOutputDto | null> {
        return this.statsService.assignPlayerToStats(statsId, playerId);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id/assign-match/:matchId')
    assignMatchToStats(
        @Param('id', ParseIntPipe) statsId: number,
        @Param('matchId', ParseIntPipe) matchId: number,
    ): Promise<StatsOutputDto | null> {
        return this.statsService.assignMatchToStats(statsId, matchId);
    }
}
