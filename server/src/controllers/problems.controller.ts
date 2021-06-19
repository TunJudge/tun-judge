import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard } from '../core/guards';
import { Roles } from '../core/roles.decorator';
import { Problem } from '../entities';
import { ProblemsService, SubmissionsService } from '../services';

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
  getById(@Param('id') id: number): Promise<Problem> {
    return this.problemsService.getById(id, ['testcases', 'file', 'file.content']);
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
  async update(@Param('id') id: number, @Body() problem: Problem): Promise<Problem> {
    return this.problemsService.update(id, problem);
  }

  @Delete(':id')
  @Roles('admin')
  delete(@Param('id') id: number): Promise<void> {
    return this.problemsService.delete(id);
  }
}
