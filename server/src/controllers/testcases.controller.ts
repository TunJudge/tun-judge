import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard, AuthenticatedGuard } from '../core/guards';
import { ExtendedRepository } from '../core/extended-repository';
import { File, FileContent, Testcase } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan } from 'typeorm';
import { JudgeHostGuard } from '../core/guards/judge-host.guard';

@Controller('testcases')
@UseGuards(AuthenticatedGuard)
export class TestcasesController {
  constructor(
    @InjectRepository(Testcase)
    private readonly testcasesRepository: ExtendedRepository<Testcase>,
    @InjectRepository(File)
    private readonly filesRepository: ExtendedRepository<File>,
  ) {}

  @Get('problem/:id')
  @UseGuards(AdminGuard)
  getByProblemId(@Param('id') id: number): Promise<Testcase[]> {
    return this.testcasesRepository.find({
      where: { problem: { id } },
      order: { rank: 'ASC' },
    });
  }

  @Post('problem/:id')
  @UseGuards(AdminGuard)
  async create(
    @Param('id') id: number,
    @Body() testcase: Testcase,
  ): Promise<Testcase> {
    return this.testcasesRepository.save({
      ...testcase,
      problem: { id },
      rank: await this.testcasesRepository.count({ problem: { id } }),
    });
  }

  @Put(':id')
  @UseGuards(AdminGuard)
  async update(
    @Param('id') id: number,
    @Body() testcase: Testcase,
  ): Promise<Testcase> {
    const oldTestcase = await this.testcasesRepository.findOneOrThrow(
      id,
      new NotFoundException(),
    );
    return this.testcasesRepository.save({ ...oldTestcase, ...testcase });
  }

  @Patch(':id/:dir')
  @UseGuards(AdminGuard)
  async move(
    @Param('id') id: number,
    @Param('dir') direction: 'up' | 'down',
  ): Promise<void> {
    const testcase = await this.testcasesRepository.findOneOrThrow(
      id,
      { relations: ['problem'] },
      new NotFoundException(),
    );
    const otherTestcase = await this.testcasesRepository.findOne({
      problem: { id: testcase.problem.id },
      rank: direction === 'up' ? testcase.rank - 1 : testcase.rank + 1,
    });
    if (otherTestcase) {
      const aux = otherTestcase.rank;
      otherTestcase.rank = testcase.rank;
      await this.testcasesRepository.save({ ...testcase, rank: -1 });
      await this.testcasesRepository.save(otherTestcase);
      await this.testcasesRepository.save({ ...testcase, rank: aux });
    }
  }

  @Get(':id/content/:file')
  @UseGuards(JudgeHostGuard)
  getContent(
    @Param('id') id: number,
    @Param('file') file: 'input' | 'output',
  ): Promise<FileContent> {
    return this.testcasesRepository
      .findOneOrThrow(id, new NotFoundException())
      .then((testcase) =>
        this.filesRepository.findOneOrThrow(
          testcase[file].id,
          { relations: ['content'] },
          new NotFoundException(),
        ),
      )
      .then((file) => file.content);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  async delete(@Param('id') id: number): Promise<void> {
    const testcase = await this.testcasesRepository.findOneOrThrow(
      id,
      new NotFoundException(),
    );
    await this.testcasesRepository.delete(id);
    const testcases = await this.testcasesRepository.find({
      where: {
        rank: MoreThan(testcase.rank),
      },
    });
    for (const t of testcases) {
      await this.testcasesRepository.save({ ...t, rank: t.rank - 1 });
    }
  }
}
