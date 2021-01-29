import {
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AppGateway } from '../app.gateway';
import { AuthenticatedGuard } from '../core/guards';
import { Roles } from '../core/roles.decorator';
import { FileContent, Submission } from '../entities';
import {
  FilesService,
  JudgingRunsService,
  JudgingsService,
  ScoreboardService,
  SubmissionsService,
} from '../services';

@Controller('submissions')
@UseGuards(AuthenticatedGuard)
export class SubmissionsController {
  constructor(
    private readonly judgingRunsService: JudgingRunsService,
    private readonly filesService: FilesService,
    private readonly judgingsService: JudgingsService,
    private readonly scoreboardService: ScoreboardService,
    private readonly submissionsService: SubmissionsService,
    private readonly socketService: AppGateway,
  ) {}

  @Get()
  @Roles('admin', 'jury')
  async getAll(
    @Query('page') page: number,
    @Query('size') size: number,
    @Query('problems') problems: string,
    @Query('teams') teams: string,
    @Query('languages') languages: string,
    @Query('notJudged') _notJudged: string,
    @Query('notVerified') _notVerified: string,
  ): Promise<[Submission[], number]> {
    return this.submissionsService.search(
      page,
      size,
      problems,
      teams,
      languages,
      _notJudged,
      _notVerified,
    );
  }

  @Get(':id')
  @Roles('admin', 'jury')
  getById(@Param('id') id: number): Promise<Submission> {
    return this.submissionsService.getById(id);
  }

  @Patch(':id/mark-verified')
  @Roles('admin', 'jury')
  async markSubmissionVerified(
    @Param('id') id: number,
    @Session()
    {
      passport: {
        user: { id: userId },
      },
    },
  ): Promise<void> {
    await this.judgingsService.setVerified(id, userId);
    this.socketService.pingForUpdates('judgings', 'submissions');
  }

  @Patch(':id/claim')
  @Roles('admin', 'jury')
  async claimSubmission(
    @Param('id') id: number,
    @Session()
    {
      passport: {
        user: { id: userId },
      },
    },
  ): Promise<void> {
    await this.judgingsService.setJuryMember(id, userId);
    await this.socketService.pingForUpdates('judgings');
  }

  @Patch(':id/un-claim')
  @Roles('admin', 'jury')
  async unClaimSubmission(
    @Param('id') id: number,
    @Session()
    {
      passport: {
        user: { id: userId },
      },
    },
  ): Promise<void> {
    await this.judgingsService.setJuryMember(id, userId, null);
    await this.socketService.pingForUpdates('judgings');
  }

  @Patch(':id/rejudge')
  @Roles('admin', 'jury')
  async rejudgeSubmission(@Param('id') id: number): Promise<void> {
    await this.submissionsService.rejudge(id);
    await this.socketService.pingForUpdates('judgings', 'submissions');
  }

  @Patch(':id/ignore')
  @Roles('admin', 'jury')
  async ignoreSubmission(@Param('id') id: number): Promise<void> {
    await this.submissionsService.setValid(id, false);
    this.socketService.pingForUpdates('judgings', 'submissions');
  }

  @Patch(':id/un-ignore')
  @Roles('admin', 'jury')
  async unIgnoreSubmission(@Param('id') id: number): Promise<void> {
    await this.submissionsService.setValid(id, true);
    this.socketService.pingForUpdates('judgings', 'submissions');
  }

  @Get(':id/run/:runId/content')
  @Roles('admin', 'judge-host')
  getRunContent(
    @Param('id') id: number,
    @Param('runId') runId: number,
  ): Promise<FileContent> {
    return this.judgingRunsService
      .getById(runId, ['runOutput'])
      .then((run) => this.filesService.getById(run.runOutput.id, ['content']))
      .then((file) => file.content);
  }
}
