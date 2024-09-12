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
import { ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { LogClass } from '../../core/log.decorator';
import { Roles } from '../../core/roles.decorator';
import { NumberParam } from '../../core/utils';
import { FileContent, Testcase } from '../../entities';
import { AuthenticatedGuard } from '../../guards';
import { TestcasesService } from './testcases.service';

@LogClass
@ApiTags('Testcases')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@Controller('testcases')
@UseGuards(AuthenticatedGuard)
export class TestcasesController {
  constructor(private readonly testcasesService: TestcasesService) {}

  @Get('problem/:id')
  @Roles('admin', 'jury')
  getByProblemId(@NumberParam('id') id: number): Promise<Testcase[]> {
    return this.testcasesService.getByProblemId(id);
  }

  @Post('problem/:id')
  @Roles('admin')
  async create(@NumberParam('id') id: number, @Body() testcase: Testcase): Promise<Testcase> {
    return this.testcasesService.create(id, testcase);
  }

  @Put(':id')
  @Roles('admin')
  update(@NumberParam('id') id: number, @Body() testcase: Testcase): Promise<Testcase> {
    return this.testcasesService.update(id, testcase);
  }

  @Patch(':id/:dir')
  @Roles('admin', 'jury')
  move(@NumberParam('id') id: number, @Param('dir') direction: 'up' | 'down'): Promise<void> {
    return this.testcasesService.move(id, direction);
  }

  @Get(':id/content/:file')
  @Roles('admin', 'jury', 'judge-host')
  getContent(
    @NumberParam('id') id: number,
    @Param('file') file: 'input' | 'output'
  ): Promise<FileContent> {
    if (!['input', 'output'].includes(file)) {
      throw new BadRequestException("file parameter should be either 'input' or 'output'");
    }
    return this.testcasesService.getContent(id, file);
  }

  @Delete(':id')
  @Roles('admin')
  delete(@NumberParam('id') id: number): Promise<void> {
    return this.testcasesService.delete(id);
  }
}
