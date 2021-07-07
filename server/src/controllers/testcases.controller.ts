import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthenticatedGuard } from '../core/guards';
import { LogClass } from '../core/log.decorator';
import { Roles } from '../core/roles.decorator';
import { FileContent, Testcase } from '../entities';
import { TestcasesService } from '../services';

@LogClass
@Controller('testcases')
@UseGuards(AuthenticatedGuard)
export class TestcasesController {
  constructor(private readonly testcasesService: TestcasesService) {}

  @Get('problem/:id')
  @Roles('admin', 'jury')
  getByProblemId(@Param('id') id: number): Promise<Testcase[]> {
    return this.testcasesService.getByProblemId(id);
  }

  @Post('problem/:id')
  @Roles('admin')
  async create(@Param('id') id: number, @Body() testcase: Testcase): Promise<Testcase> {
    return this.testcasesService.create(id, testcase);
  }

  @Put(':id')
  @Roles('admin')
  update(@Param('id') id: number, @Body() testcase: Testcase): Promise<Testcase> {
    return this.testcasesService.update(id, testcase);
  }

  @Patch(':id/:dir')
  @Roles('admin', 'jury')
  move(@Param('id') id: number, @Param('dir') direction: 'up' | 'down'): Promise<void> {
    return this.testcasesService.move(id, direction);
  }

  @Get(':id/content/:file')
  @Roles('admin', 'jury', 'judge-host')
  getContent(
    @Param('id') id: number,
    @Param('file') file: 'input' | 'output',
  ): Promise<FileContent> {
    if (!['input', 'output'].includes(file)) {
      throw new BadRequestException("file parameter should be either 'input' or 'output'");
    }
    return this.testcasesService.getContent(id, file);
  }

  @Delete(':id')
  @Roles('admin')
  delete(@Param('id') id: number): Promise<void> {
    return this.testcasesService.delete(id);
  }
}
