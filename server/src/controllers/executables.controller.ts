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
import { AdminGuard, AuthenticatedGuard } from '../core/guards';
import { ExtendedRepository } from '../core/extended-repository';
import { Executable } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Not } from 'typeorm';

@Controller('executables')
@UseGuards(AuthenticatedGuard)
export class ExecutablesController {
  constructor(
    @InjectRepository(Executable)
    private readonly executablesRepository: ExtendedRepository<Executable>,
  ) {}

  @Get()
  @UseGuards(AdminGuard)
  getAll(): Promise<Executable[]> {
    return this.executablesRepository.find({
      order: { id: 'ASC' },
      relations: ['file', 'file.content', 'buildScript', 'buildScript.content'],
    });
  }

  @Post()
  @UseGuards(AdminGuard)
  async create(@Body() executable: Executable): Promise<Executable> {
    if (executable.default) {
      await this.executablesRepository.update(
        { type: executable.type, default: true },
        { default: false },
      );
    }
    return this.executablesRepository.save(executable);
  }

  @Put(':id')
  @UseGuards(AdminGuard)
  async update(
    @Param('id') id: number,
    @Body() executable: Executable,
  ): Promise<Executable> {
    const oldExecutable = await this.executablesRepository.findOneOrThrow(
      id,
      new NotFoundException(),
    );
    if (executable.default) {
      await this.executablesRepository.update(
        { id: Not(executable.id), type: executable.type, default: true },
        { default: false },
      );
    }
    return this.executablesRepository.save({ ...oldExecutable, ...executable });
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  async delete(@Param('id') id: number): Promise<void> {
    await this.executablesRepository.delete(id);
  }
}
