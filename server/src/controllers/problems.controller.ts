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
import { Problem } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Roles } from '../core/roles.decorator';

@Controller('problems')
@UseGuards(AuthenticatedGuard)
export class ProblemsController {
  constructor(
    @InjectRepository(Problem)
    private readonly problemsRepository: ExtendedRepository<Problem>,
  ) {}

  @Get()
  @Roles('admin', 'jury')
  getAll(): Promise<Problem[]> {
    return this.problemsRepository.find({
      order: { id: 'ASC' },
      relations: [
        'testcases',
        'file',
        'file.content',
        'runScript',
        'checkScript',
      ],
    });
  }

  @Get(':id')
  @Roles('admin', 'jury')
  getById(@Param('id') id: number): Promise<Problem> {
    return this.problemsRepository.findOneOrThrow(
      id,
      { relations: ['testcases', 'file', 'file.content'] },
      new NotFoundException(),
    );
  }

  @Post()
  @Roles('admin')
  create(@Body() problem: Problem): Promise<Problem> {
    return this.problemsRepository.save(problem);
  }

  @Put(':id')
  @Roles('admin')
  async update(
    @Param('id') id: number,
    @Body() problem: Problem,
  ): Promise<Problem> {
    const oldProblem = await this.problemsRepository.findOneOrThrow(
      id,
      new NotFoundException(),
    );
    return this.problemsRepository.save({ ...oldProblem, ...problem });
  }

  @Delete(':id')
  @Roles('admin')
  async delete(@Param('id') id: number): Promise<void> {
    await this.problemsRepository.delete(id);
  }
}
