import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthenticatedGuard } from '../core/guards';
import { ExtendedRepository } from '../core/extended-repository';
import { Team } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Roles } from '../core/roles.decorator';

@Controller('teams')
@UseGuards(AuthenticatedGuard)
export class TeamsController {
  constructor(
    @InjectRepository(Team)
    private readonly teamsRepository: ExtendedRepository<Team>,
  ) {}

  @Get()
  @Roles('admin', 'jury')
  getAll(): Promise<Team[]> {
    return this.teamsRepository.find({
      order: { id: 'ASC' },
      relations: ['user', 'category', 'contests'],
    });
  }

  @Post()
  @Roles('admin')
  async create(@Body() team: Team): Promise<Team> {
    return this.teamsRepository.save(team);
  }

  @Put(':id')
  @Roles('admin')
  async update(@Param('id') id: number, @Body() team: Team): Promise<Team> {
    const oldTeam = await this.teamsRepository.findOneOrThrow(
      id,
      new NotFoundException(),
    );
    return this.teamsRepository.save({
      ...oldTeam,
      ...team,
    });
  }

  @Delete(':id')
  @Roles('admin')
  async delete(@Param('id') id: number): Promise<void> {
    await this.teamsRepository.delete(id);
  }
}
