import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthenticatedGuard } from '../core/guards';
import { Roles } from '../core/roles.decorator';
import { Team } from '../entities';
import { TeamsService } from '../services';

@Controller('teams')
@UseGuards(AuthenticatedGuard)
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  @Roles('admin', 'jury')
  getAll(): Promise<Team[]> {
    return this.teamsService.getAll();
  }

  @Post()
  @Roles('admin')
  create(@Body() team: Team): Promise<Team> {
    return this.teamsService.save(team);
  }

  @Put(':id')
  @Roles('admin')
  update(@Param('id') id: number, @Body() team: Team): Promise<Team> {
    return this.teamsService.update(id, team);
  }

  @Delete(':id')
  @Roles('admin')
  delete(@Param('id') id: number): Promise<void> {
    return this.teamsService.delete(id);
  }
}
