import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { CompetitionService } from '../application/CompetitionService';
import { CompetitionInputDto } from './dto/CompetitionInputDto';
import { CompetitionUpdateInputDto } from './dto/CompetitionUpdateInputDto';
import { CompetitionOutputDto } from './dto/CompetitionOutputDto';
import { JwtAuthGuard } from 'src/auth/JwtAuthGuard';
import type { Request } from 'express';

@Controller('competition')
export class CompetitionController {
    constructor(private readonly competitionService: CompetitionService) {}

    @Get()
    findAll(): Promise<CompetitionOutputDto[]> {
        return this.competitionService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get('my')
    findMyCompetitions(
        @Req() req: Request,
    ) {
        const user = req.user as { userId: number };
        return this.competitionService.findByOwner(user.userId);
    }

    @Get(':id')
    findOne(
        @Param('id', ParseIntPipe) id: number
    ): Promise<CompetitionOutputDto | null> {
        return this.competitionService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    createCompetition(
        @Body() dto: CompetitionInputDto,
        @Req() req: Request,
    ): Promise<CompetitionOutputDto> {
        const user = req.user as { userId: number };
        return this.competitionService.createCompetition(dto, user.userId);
    }


    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    updateCompetition(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: CompetitionUpdateInputDto
    ): Promise<CompetitionOutputDto | null> {
        return this.competitionService.updateCompetition(id, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    deleteCompetition(@Param('id', ParseIntPipe) id: number) {
        return this.competitionService.deleteCompetition(id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id/team/:teamId')
    addTeamToCompetition(
        @Param('id', ParseIntPipe) competitionId: number,
        @Param('teamId', ParseIntPipe) teamId: number,
        @Req() req: Request,
    ): Promise<CompetitionOutputDto | null> {
        const requester = req.user as {userId: number};      
        return this.competitionService.addTeamToCompetition(competitionId, teamId, requester.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id/remove-team/:teamId')
    removeTeamFromCompetition(
        @Param('id', ParseIntPipe) competitionId: number,
        @Param('teamId', ParseIntPipe) teamId: number,
    ): Promise<CompetitionOutputDto | null> {
        return this.competitionService.removeTeamFromCompetition(competitionId, teamId);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id/teams')
    getTeamsInCompetition(
        @Param('id', ParseIntPipe) competitionId: number,
    ): Promise<any[]> {
        return this.competitionService.getTeamsInCompetition(competitionId);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id/matches')
    getMatchesInCompetition(
        @Param('id', ParseIntPipe) competitionId: number,
    ): Promise<any[]> {
        return this.competitionService.getMatchesInCompetition(competitionId);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id/match/:matchId')
    addMatchToCompetition(
        @Param('id', ParseIntPipe) competitionId: number,
        @Param('matchId', ParseIntPipe) matchId: number,
    ): Promise<CompetitionOutputDto | null> {
        return this.competitionService.addMatchToCompetition(competitionId, matchId);
    }
    
    
}
