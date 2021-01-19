import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Query,
  Session,
  UseGuards,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminGuard, AuthenticatedGuard } from '../core/guards';
import { ExtendedRepository } from '../core/extended-repository';
import {
  File,
  FileContent,
  Judging,
  JudgingRun,
  Submission,
} from '../entities';
import { JudgeHostGuard } from '../core/guards/judge-host.guard';
import { JuryGuard } from '../core/guards/jury.guard';
import { ScoreboardService } from '../scoreboard.service';

@Controller('submissions')
@UseGuards(AuthenticatedGuard)
export class SubmissionsController {
  constructor(
    @InjectRepository(Submission)
    private readonly submissionsRepository: ExtendedRepository<Submission>,
    @InjectRepository(Judging)
    private readonly judgingsRepository: ExtendedRepository<Judging>,
    @InjectRepository(JudgingRun)
    private readonly judgingRunsRepository: ExtendedRepository<JudgingRun>,
    @InjectRepository(File)
    private readonly filesRepository: ExtendedRepository<File>,
    private readonly scoreboardService: ScoreboardService,
  ) {}

  @Get()
  @UseGuards(AdminGuard)
  async getAll(
    @Query('page') page: number,
    @Query('size') size: number,
    @Query('problems') problems: string,
    @Query('teams') teams: string,
    @Query('languages') languages: string,
    @Query('notJudged') _notJudged: string,
    @Query('notVerified') _notVerified: string,
  ): Promise<[Submission[], number]> {
    page ??= 0;
    size ??= 10;
    const notJudged = Boolean(_notJudged === 'true');
    const notVerified = Boolean(_notVerified === 'true');
    let query = this.submissionsRepository
      .createQueryBuilder('submission')
      .leftJoinAndSelect('submission.team', 'team')
      .leftJoinAndSelect('submission.problem', 'problem')
      .leftJoinAndSelect('submission.language', 'language')
      .leftJoinAndSelect('problem.testcases', 'testcases')
      .leftJoinAndSelect('submission.contest', 'contest')
      .leftJoinAndSelect('submission.judgings', 'judgings')
      .leftJoinAndSelect('judgings.juryMember', 'juryMember')
      .leftJoinAndSelect('judgings.runs', 'runs')
      .leftJoinAndSelect('runs.testcase', 'testcase')
      .orderBy('submission.submitTime', 'DESC')
      .take(size)
      .skip(size * page);
    if (problems) {
      query = query.andWhere('problem.id IN (:...problemIds)', {
        problemIds: problems.split(',').map((i) => parseInt(i)),
      });
    }
    if (teams) {
      query = query.andWhere('team.id IN (:...teamIds)', {
        teamIds: teams.split(',').map((i) => parseInt(i)),
      });
    }
    if (languages) {
      query = query.andWhere('language.id IN (:...languageIds)', {
        languageIds: languages.split(',').map((i) => parseInt(i)),
      });
    }
    if (notJudged) {
      query = query.andWhere(
        '(SELECT COUNT(*) FROM judging WHERE "judging"."submissionId" = "submission"."id") = 0',
      );
    }
    if (notVerified) {
      query = query.andWhere(
        '(SELECT COUNT(*) FROM judging WHERE "judging"."submissionId" = "submission"."id" AND "judging"."verified" = FALSE) > 0',
      );
    }
    return query.getManyAndCount();
  }

  @Get(':id')
  @UseGuards(AdminGuard)
  getById(@Param('id') id: number): Promise<Submission> {
    return this.submissionsRepository.findOneOrThrow(
      {
        where: { id },
        order: { submitTime: 'DESC' },
        relations: [
          'team',
          'file',
          'file.content',
          'problem',
          'problem.testcases',
          'language',
          'contest',
          'judgings',
          'judgings.juryMember',
          'judgings.runs',
          'judgings.runs.testcase',
          'judgings.runs.runOutput',
          'judgings.runs.checkerOutput',
          'judgings.runs.checkerOutput.content',
          'judgings.runs.errorOutput',
          'judgings.runs.errorOutput.content',
        ],
      },
      new NotFoundException(),
    );
  }

  @Patch(':id/mark-verified')
  @UseGuards(JuryGuard)
  async markSubmissionVerified(
    @Param('id') id: number,
    @Session()
    {
      passport: {
        user: { id: userId },
      },
    },
  ): Promise<void> {
    const {
      id: judgingId,
      contest,
      submission: { team, problem },
    } = await this.judgingsRepository.findOneOrThrow(
      {
        where: { submission: { id } },
        relations: [
          'contest',
          'submission',
          'submission.team',
          'submission.problem',
        ],
        order: { startTime: 'DESC' },
      },
      new NotFoundException(),
    );
    await this.judgingsRepository.update(judgingId, {
      juryMember: { id: userId },
      verified: true,
    });
    await this.scoreboardService.refreshScoreCache(contest, team, problem);
  }

  @Patch(':id/claim')
  @UseGuards(JuryGuard)
  async claimSubmission(
    @Param('id') id: number,
    @Session()
    {
      passport: {
        user: { id: userId },
      },
    },
  ): Promise<void> {
    const judging = await this.judgingsRepository.findOneOrThrow(
      {
        where: { submission: { id }, juryMember: null },
        order: { startTime: 'DESC' },
      },
      new NotFoundException(),
    );
    await this.judgingsRepository.update(judging.id, {
      juryMember: { id: userId },
    });
  }

  @Patch(':id/un-claim')
  @UseGuards(JuryGuard)
  async unClaimSubmission(
    @Param('id') id: number,
    @Session()
    {
      passport: {
        user: { id: userId },
      },
    },
  ): Promise<void> {
    const judging = await this.judgingsRepository.findOneOrThrow(
      {
        order: { startTime: 'DESC' },
        where: { submission: { id }, juryMember: { id: userId } },
      },
      new NotFoundException(),
    );
    await this.judgingsRepository.update(judging.id, {
      juryMember: null,
    });
  }

  @Get(':id/run/:runId/content')
  @UseGuards(JudgeHostGuard)
  async getRunContent(
    @Param('id') id: number,
    @Param('runId') runId: number,
  ): Promise<FileContent> {
    await this.submissionsRepository.findOneOrThrow(
      id,
      new NotFoundException(),
    );
    return this.judgingRunsRepository
      .findOneOrThrow(
        runId,
        { relations: ['runOutput'] },
        new NotFoundException(),
      )
      .then((run) =>
        this.filesRepository.findOneOrThrow(
          run.runOutput.id,
          { relations: ['content'] },
          new NotFoundException(),
        ),
      )
      .then((file) => file.content);
  }
}
