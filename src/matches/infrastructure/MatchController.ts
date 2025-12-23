import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { MatchesService } from '../application/MatchService';
import { MatchInputDto } from './dto/MatchInputDto';
import { MatchUpdateInputDto } from './dto/MatchUpdateInputDto';
import { MatchOutputDto } from './dto/MatchOutputDto';
import { JwtAuthGuard } from 'src/auth/JwtAuthGuard';
import { Roles } from 'src/auth/RolesDecorator';
import { RolesGuard } from 'src/auth/RolesGuard';


@Controller('matches')
export class MatchesController {
    constructor(private readonly matchService: MatchesService) {}

    // 🟢 Público
    @Get()
    findAll(): Promise<MatchOutputDto[]> {
        return this.matchService.findAll();
    }

    // 🟢 Público
    @Get(':id')
    findOne(
        @Param('id', ParseIntPipe) id: number
    ): Promise<MatchOutputDto | null> {
        return this.matchService.findOne(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post()
    createMatch(
        @Body() dto: MatchInputDto
    ): Promise<MatchOutputDto> {
        return this.matchService.createMatch(dto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Patch(':id')
    updateMatch(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: MatchUpdateInputDto
    ): Promise<MatchOutputDto | null> {
        return this.matchService.updateMatch(id, dto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    deleteMatch(@Param('id', ParseIntPipe) id: number) {
        return this.matchService.deleteMatch(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Patch(':id/competition/:competitionId')
    assignMatchToCompetition(
        @Param('id', ParseIntPipe) matchId: number,
        @Param('competitionId', ParseIntPipe) competitionId: number
    ): Promise<MatchOutputDto | null> {
        return this.matchService.assignMatchToCompetition(matchId, competitionId);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Patch(':id/home-team/:teamId')
    assignHomeTeamToMatch(
        @Param('id', ParseIntPipe) matchId: number,
        @Param('teamId', ParseIntPipe) teamId: number
    ): Promise<MatchOutputDto | null> {
        return this.matchService.assignHomeTeamToMatch(matchId, teamId);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Patch(':id/away-team/:teamId')
    assignAwayTeamToMatch(
        @Param('id', ParseIntPipe) matchId: number,
        @Param('teamId', ParseIntPipe) teamId: number
    ): Promise<MatchOutputDto | null> {
        return this.matchService.assignAwayTeamToMatch(matchId, teamId);
    }

    // 🟢 Público
    @Get(':id/stats')
    getMatchStats(
        @Param('id', ParseIntPipe) matchId: number
    ) {
        return this.matchService.getMatchStats(matchId);
    }
}
