import {
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AuthenticatedGuard } from '../core/guards';
import { InjectRepository } from '@nestjs/typeorm';
import { JudgeHost, Submission } from '../entities';
import { ExtendedRepository } from '../core/extended-repository';
import { JudgeHostGuard } from '../core/guards/judge-host.guard';

@Controller('judge-hosts')
@UseGuards(AuthenticatedGuard)
export class JudgeHostsController {
  constructor(
    @InjectRepository(JudgeHost)
    private readonly judgeHostsRepository: ExtendedRepository<JudgeHost>,
    @InjectRepository(Submission)
    private readonly submissionsRepository: ExtendedRepository<Submission>,
  ) {}

  @Get(':hostname/next-submission')
  @UseGuards(JudgeHostGuard)
  async getNextSubmission(
    @Param('hostname') hostname: string,
  ): Promise<Submission | undefined> {
    const judgeHost = await this.judgeHostsRepository.findOneOrThrow(
      { hostname },
      new NotFoundException(),
    );
    const submission = await this.submissionsRepository.findOne({
      where: { judgeHost: null },
      relations: [
        'file',
        'file.content',
        'language',
        'language.buildScript',
        'language.buildScript.content',
        'problem',
        'problem.testcases',
        'problem.runScript',
        'problem.runScript.file',
        'problem.runScript.file.content',
        'problem.runScript.buildScript',
        'problem.runScript.buildScript.content',
        'problem.checkScript',
        'problem.checkScript.file',
        'problem.checkScript.file.content',
        'problem.checkScript.buildScript',
        'problem.checkScript.buildScript.content',
      ],
      order: { submitTime: 'ASC' },
    });
    if (submission) {
      submission.judgeHost = judgeHost;
      await this.submissionsRepository.save(submission);
      return submission;
    }
  }
}
