import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { TeamService } from '../application/TeamService';
import { TeamInputDto } from './dto/TeamInputDto';
import { TeamUpdateInputDto } from './dto/TeamUpdateInputDto';
import { TeamOutputDto } from './dto/TeamOutputDto';
import { JwtAuthGuard } from 'src/auth/JwtAuthGuard';
import type { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('team')
export class TeamController {
    constructor(private readonly teamService: TeamService) {}

    @UseGuards(JwtAuthGuard)
    @Get('my')
    getMyTeams(@Req() req: Request): Promise<TeamOutputDto[]> {
        const requester = req.user as { userId: number };
        return this.teamService.getMyTeams(requester.userId);
    }
    
    @UseGuards(JwtAuthGuard)
    @Get()
    findAll(): Promise<TeamOutputDto[]> {
        return this.teamService.findAll();
    }

    @Get(':id')
    findOne(
        @Param('id', ParseIntPipe) id: number
    ): Promise<TeamOutputDto | null> {
        return this.teamService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    createTeam(
        @Body() dto: TeamInputDto,
        @Req() req: Request,
    ): Promise<TeamOutputDto> {
        const user = req.user as { userId: number };
        return this.teamService.createTeam(dto, user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    updateTeam(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: TeamUpdateInputDto,
    ): Promise<TeamOutputDto | null> {
        return this.teamService.updateTeam(id, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    deleteTeam(@Param('id', ParseIntPipe) id: number) {
        return this.teamService.deleteTeam(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id/players')
    getAllPlayersOfTeam(
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.teamService.getAllPlayersOfTeam(id);
    }

    @Post(':id/image')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads/teams',
            filename: (_, file, cb) => {
            const uniqueName =
                Date.now() + '-' + Math.round(Math.random() * 1e9);
            const safeName = file.originalname.replace(/\s+/g, '_');
            cb(null, `${uniqueName}-${safeName}`);
            },
        }),
    }))
    uploadTeamImage(
        @Param('id', ParseIntPipe) id: number,
        @UploadedFile() file: Express.Multer.File,
        @Req() req,
    ) {
        return this.teamService.updateImage(id, `/uploads/teams/${file.filename}`);
    }


}