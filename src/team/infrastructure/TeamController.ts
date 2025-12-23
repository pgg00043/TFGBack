import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { TeamService } from '../application/TeamService';
import { TeamInputDto } from './dto/TeamInputDto';
import { TeamUpdateInputDto } from './dto/TeamUpdateInputDto';
import { TeamOutputDto } from './dto/TeamOutputDto';
import { JwtAuthGuard } from 'src/auth/JwtAuthGuard';
import { Roles } from 'src/auth/RolesDecorator';
import { RolesGuard } from 'src/auth/RolesGuard';

@Controller('team')
export class TeamController {
    constructor(private readonly teamService: TeamService) {}

    // Público
    @Get()
    findAll(): Promise<TeamOutputDto[]> {
        return this.teamService.findAll();
    }

    // Público
    @Get(':id')
    findOne(
        @Param('id', ParseIntPipe) id: number
    ): Promise<TeamOutputDto | null> {
        return this.teamService.findOne(id);
    }

    // Solo admin puede crear equipos
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post()
    createTeam(
        @Body() dto: TeamInputDto
    ): Promise<TeamOutputDto> {
        return this.teamService.createTeam(dto);
    }

    // Solo admin puede editar equipos
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Patch(':id')
    updateTeam(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: TeamUpdateInputDto,
    ): Promise<TeamOutputDto | null> {
        return this.teamService.updateTeam(id, dto);
    }

    // Solo admin puede eliminar equipos
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    deleteTeam(@Param('id', ParseIntPipe) id: number) {
        return this.teamService.deleteTeam(id);
    }
}
