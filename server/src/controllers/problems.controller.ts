import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { AuthenticatedGuard } from '../core/guards';
import { Roles } from '../core/roles.decorator';
import { unzipEntities, zipEntities } from '../core/utils';
import { Problem } from '../entities';
import { ProblemsService, SubmissionsService } from '../services';
import { ProblemTransformer } from '../transformers';

@Controller('problems')
@UseGuards(AuthenticatedGuard)
export class ProblemsController {
  constructor(
    private readonly problemsService: ProblemsService,
    private readonly submissionsService: SubmissionsService,
    private readonly problemTransformer: ProblemTransformer,
  ) {}

  @Get()
  @Roles('admin', 'jury')
  getAll(): Promise<Problem[]> {
    return this.problemsService.getAll();
  }

  @Get(':id')
  @Roles('admin', 'jury')
  getById(@Param('id') id: number): Promise<Problem> {
    return this.problemsService.getById(id, [
      'testcases',
      'file',
      'file.content',
    ]);
  }

  @Patch(':id/rejudge')
  @Roles('admin', 'jury')
  async rejudge(@Param('id') id: number): Promise<void> {
    await this.submissionsService.rejudgeByProblemId(id);
  }

  @Post()
  @Roles('admin')
  create(@Body() problem: Problem): Promise<Problem> {
    return this.problemsService.save(problem);
  }

  @Put(':id')
  @Roles('admin')
  async update(
    @Param('id') id: number,
    @Body() problem: Problem,
  ): Promise<Problem> {
    return this.problemsService.update(id, problem);
  }

  @Delete(':id')
  @Roles('admin')
  delete(@Param('id') id: number): Promise<void> {
    return this.problemsService.delete(id);
  }

  @Get(':id/zip')
  @Roles('admin')
  async getZip(
    @Param('id') id: number,
    @Res() response: Response,
  ): Promise<void> {
    return zipEntities(
      id,
      'problem.zip',
      this.problemTransformer,
      await this.problemsService.getById(id, [
        'file',
        'file.content',
        'testcases',
        'testcases.input',
        'testcases.input.content',
        'testcases.output',
        'testcases.output.content',
      ]),
      response,
    );
  }

  @Get('zip/all')
  @Roles('admin')
  async getZipAll(@Res() response: Response): Promise<void> {
    return zipEntities(
      undefined,
      'problems.zip',
      this.problemTransformer,
      await this.problemsService.getAllWithRelations([
        'file',
        'file.content',
        'testcases',
        'testcases.input',
        'testcases.input.content',
        'testcases.output',
        'testcases.output.content',
      ]),
      response,
    );
  }

  @Post('unzip')
  @Roles('admin')
  @UseInterceptors(FileInterceptor('file'))
  saveFromZip(
    @UploadedFile() file,
    @Query('multiple') multiple: string,
  ): Promise<void> {
    return unzipEntities<Problem>(
      file,
      multiple,
      this.problemTransformer,
      (problem) => this.problemsService.deepSave(problem),
    );
  }
}
