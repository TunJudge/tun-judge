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
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import * as JSZip from 'jszip';
import { ExtendedRepository } from '../core/extended-repository';
import { AuthenticatedGuard } from '../core/guards';
import { Roles } from '../core/roles.decorator';
import { Executable, Problem, Submission, Testcase } from '../entities';
import { ProblemTransformer } from '../transformers';

@Controller('problems')
@UseGuards(AuthenticatedGuard)
export class ProblemsController {
  constructor(
    @InjectRepository(Problem)
    private readonly problemsRepository: ExtendedRepository<Problem>,
    @InjectRepository(Submission)
    private readonly submissionsRepository: ExtendedRepository<Submission>,
    @InjectRepository(Executable)
    private readonly executablesRepository: ExtendedRepository<Executable>,
    @InjectRepository(Testcase)
    private readonly testcasesRepository: ExtendedRepository<Testcase>,
    private readonly problemTransformer: ProblemTransformer,
  ) {}

  @Get()
  @Roles('admin', 'jury')
  getAll(): Promise<Problem[]> {
    return this.problemsRepository.find({
      order: { id: 'ASC' },
      relations: [
        'file',
        'file.content',
        'testcases',
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

  @Patch(':id/rejudge')
  @Roles('admin', 'jury')
  async rejudge(@Param('id') id: number): Promise<void> {
    await this.submissionsRepository.update(
      { problem: { id } },
      { judgeHost: null },
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

  @Get(':id/zip')
  @Roles('admin')
  async getZip(
    @Param('id') id: number,
    @Res() response: Response,
  ): Promise<void> {
    const problem = await this.problemsRepository.findOneOrThrow(
      {
        where: { id },
        relations: [
          'file',
          'file.content',
          'testcases',
          'testcases.input',
          'testcases.input.content',
          'testcases.output',
          'testcases.output.content',
        ],
      },
      new NotFoundException(),
    );
    const zip = new JSZip();
    await this.problemTransformer.toZip(problem, zip);
    response.attachment('problem.zip');
    zip.generateNodeStream().pipe(response);
  }

  @Post('unzip')
  @Roles('admin')
  @UseInterceptors(FileInterceptor('file'))
  async saveFromZip(@UploadedFile() file): Promise<void> {
    let problem = await this.problemTransformer.fromZip(
      await JSZip.loadAsync(file.buffer),
    );
    problem.runScript = await this.executablesRepository.findOneOrThrow(
      {
        default: true,
        type: 'RUNNER',
      },
      new NotFoundException(),
    );
    problem.checkScript = await this.executablesRepository.findOneOrThrow(
      {
        default: true,
        type: 'CHECKER',
      },
      new NotFoundException(),
    );
    const testcases = problem.testcases;
    problem = await this.problemsRepository.save(problem);
    testcases.forEach((testcase) => (testcase.problem = problem));
    await this.testcasesRepository.save(testcases);
  }
}
