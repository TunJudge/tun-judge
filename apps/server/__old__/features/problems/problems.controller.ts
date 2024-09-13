import { Body, Controller, Delete, Get, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { LogClass } from '../../core/log.decorator';
import { Roles } from '../../core/roles.decorator';
import { NumberParam } from '../../core/utils';
import { Problem } from '../../entities';
import { AuthenticatedGuard } from '../../guards';
import { SubmissionsService } from '../submissions/submissions.service';
import { ProblemsService } from './problems.service';

@LogClass
@ApiTags('Problems')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@Controller('problems')
@UseGuards(AuthenticatedGuard)
export class ProblemsController {
  constructor(
    private readonly problemsService: ProblemsService,
    private readonly submissionsService: SubmissionsService,
  ) {}

  @Get()
  @Roles('admin', 'jury')
  getAll(): Promise<Problem[]> {
    return this.problemsService.getAll();
  }

  @Get(':id')
  @Roles('admin', 'jury')
  getById(@NumberParam('id') id: number): Promise<Problem> {
    return this.problemsService.getById(id, ['testcases', 'file', 'file.content']);
  }

  @Patch(':id/rejudge')
  @Roles('admin', 'jury')
  async rejudge(@NumberParam('id') id: number): Promise<void> {
    await this.submissionsService.rejudgeByProblemId(id);
  }

  @Post()
  @Roles('admin')
  create(@Body() problem: Problem): Promise<Problem> {
    return this.problemsService.save(problem);
  }

  @Put(':id')
  @Roles('admin')
  async update(@NumberParam('id') id: number, @Body() problem: Problem): Promise<Problem> {
    return this.problemsService.update(id, problem);
  }

  @Delete(':id')
  @Roles('admin')
  delete(@NumberParam('id') id: number): Promise<void> {
    return this.problemsService.delete(id);
  }
}
