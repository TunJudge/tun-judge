import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard } from '../core/guards';
import { Roles } from '../core/roles.decorator';
import { Executable } from '../entities';
import { ExecutablesService } from '../services';

@Controller('executables')
@UseGuards(AuthenticatedGuard)
export class ExecutablesController {
  constructor(private readonly executablesService: ExecutablesService) {}

  @Get()
  @Roles('admin', 'jury')
  getAll(): Promise<Executable[]> {
    return this.executablesService.getAll();
  }

  @Post()
  @Roles('admin')
  async create(@Body() executable: Executable): Promise<Executable> {
    return this.executablesService.save(executable);
  }

  @Put(':id')
  @Roles('admin')
  async update(@Param('id') id: number, @Body() executable: Executable): Promise<Executable> {
    return this.executablesService.update(id, executable);
  }

  @Delete(':id')
  @Roles('admin')
  async delete(@Param('id') id: number): Promise<void> {
    await this.executablesService.delete(id);
  }
}
