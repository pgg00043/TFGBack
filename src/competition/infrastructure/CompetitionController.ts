import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { CompetitionService } from '../application/CompetitionService';
import { CompetitionInputDto } from './dto/CompetitionInputDto';
import { CompetitionUpdateInputDto } from './dto/CompetitionUpdateInputDto';
import { CompetitionOutputDto } from './dto/CompetitionOutputDto';
import { JwtAuthGuard } from 'src/auth/JwtAuthGuard';
import { Roles } from 'src/auth/RolesDecorator';
import { RolesGuard } from 'src/auth/RolesGuard';

@Controller('competition')
export class CompetitionController {
    constructor(private readonly competitionService: CompetitionService) {}

    // Público
    @Get()
    findAll(): Promise<CompetitionOutputDto[]> {
        return this.competitionService.findAll();
    }

    // Público
    @Get(':id')
    findOne(
        @Param('id', ParseIntPipe) id: number
    ): Promise<CompetitionOutputDto | null> {
        return this.competitionService.findOne(id);
    }

    // Solo admin crea competiciones
    @Roles('admin')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post()
    createCompetition(
        @Body() dto: CompetitionInputDto
    ): Promise<CompetitionOutputDto> {
        return this.competitionService.createCompetition(dto);
    }

    // Solo admin actualiza competiciones
    @Roles('admin')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Patch(':id')
    updateCompetition(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: CompetitionUpdateInputDto
    ): Promise<CompetitionOutputDto | null> {
        return this.competitionService.updateCompetition(id, dto);
    }

    // Solo admin elimina competiciones
    @Roles('admin')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    deleteCompetition(@Param('id', ParseIntPipe) id: number) {
        return this.competitionService.deleteCompetition(id);
    }

    // Solo admin puede añadir equipos a competiciones
    @Roles('admin')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Patch(':id/add-team/:teamId')
    addTeamToCompetition(
        @Param('id', ParseIntPipe) competitionId: number,
        @Param('teamId', ParseIntPipe) teamId: number,
    ): Promise<CompetitionOutputDto | null> {
        return this.competitionService.addTeamToCompetition(competitionId, teamId);
    }

    // Solo admin puede quitar equipos de competiciones
    @Roles('admin')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Patch(':id/remove-team/:teamId')
    removeTeamFromCompetition(
        @Param('id', ParseIntPipe) competitionId: number,
        @Param('teamId', ParseIntPipe) teamId: number,
    ): Promise<CompetitionOutputDto | null> {
        return this.competitionService.removeTeamFromCompetition(competitionId, teamId);
    }
}
