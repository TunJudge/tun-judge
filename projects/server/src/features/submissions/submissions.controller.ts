import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseArrayPipe,
  ParseIntPipe,
  Patch,
  Query,
  Session,
  UseGuards,
} from '@nestjs/common';
import {
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { LogClass } from '../../core/log.decorator';
import { Roles } from '../../core/roles.decorator';
import { NumberParam } from '../../core/utils';
import { FileContent, Submission } from '../../entities';
import { AuthenticatedGuard } from '../../guards';
import { FilesService } from '../files/files.service';
import { JudgingRunsService } from '../judge-hosts/judging-runs.service';
import { JudgingsService } from '../judge-hosts/judgings.service';
import { ScoreboardService } from '../scoreboard/scoreboard.service';
import { WebsocketGateway } from '../websocket/websocket.gateway';
import { SubmissionsService } from './submissions.service';

@LogClass
@ApiTags('Submissions')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@Controller('submissions')
@UseGuards(AuthenticatedGuard)
export class SubmissionsController {
  constructor(
    private readonly judgingRunsService: JudgingRunsService,
    private readonly filesService: FilesService,
    private readonly judgingsService: JudgingsService,
    private readonly scoreboardService: ScoreboardService,
    private readonly submissionsService: SubmissionsService,
    private readonly socketService: WebsocketGateway
  ) {}

  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'size', required: false })
  @ApiQuery({ name: 'contest', required: false })
  @ApiQuery({ name: 'problems', required: false })
  @ApiQuery({ name: 'teams', required: false })
  @ApiQuery({ name: 'languages', required: false })
  @ApiQuery({ name: 'status', enum: ['notJudged', 'notVerified'], required: false })
  @ApiResponse({
    schema: {
      type: 'array',
      items: {
        anyOf: [{ type: 'array', items: { $ref: getSchemaPath(Submission) } }, { type: 'number' }],
      },
    },
  })
  @Get()
  @Roles('admin', 'jury')
  async getAll(
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
    @Query('size', new DefaultValuePipe(10), ParseIntPipe) size: number,
    @Query('contest') contest: string,
    @Query('problems', new ParseArrayPipe({ items: Number, optional: true })) problems: number[],
    @Query('teams', new ParseArrayPipe({ items: Number, optional: true })) teams: number[],
    @Query('languages', new ParseArrayPipe({ items: Number, optional: true })) languages: number[],
    @Query('status') status: 'notJudged' | 'notVerified' | undefined
  ): Promise<[Submission[], number]> {
    return this.submissionsService.search(
      page,
      size,
      contest && parseInt(contest),
      problems,
      teams,
      languages,
      status
    );
  }

  @Get(':id')
  @Roles('admin', 'jury')
  getById(@NumberParam('id') id: number): Promise<Submission> {
    return this.submissionsService.getById(id);
  }

  @Patch(':id/mark-verified')
  @Roles('admin', 'jury')
  async markSubmissionVerified(
    @NumberParam('id') id: number,
    @Session()
    {
      passport: {
        user: { id: userId },
      },
    }
  ): Promise<void> {
    const judging = await this.judgingsService.setVerified(id, userId);
    this.socketService.pingForUpdates('juries', 'judgings');
    this.socketService.pingForUpdates(`team-${judging.submission.team.id}`, 'submissions');
  }

  @Patch(':id/claim')
  @Roles('admin', 'jury')
  async claimSubmission(
    @NumberParam('id') id: number,
    @Session()
    {
      passport: {
        user: { id: userId },
      },
    }
  ): Promise<void> {
    await this.judgingsService.setJuryMember(id, userId);
    this.socketService.pingForUpdates('juries', 'judgings');
  }

  @Patch(':id/un-claim')
  @Roles('admin', 'jury')
  async unClaimSubmission(
    @NumberParam('id') id: number,
    @Session()
    {
      passport: {
        user: { id: userId },
      },
    }
  ): Promise<void> {
    await this.judgingsService.setJuryMember(id, userId, null);
    this.socketService.pingForUpdates('juries', 'judgings');
  }

  @Patch(':id/rejudge')
  @Roles('admin', 'jury')
  async rejudgeSubmission(@NumberParam('id') id: number): Promise<void> {
    await this.submissionsService.rejudge(id);
    this.socketService.pingForUpdates('all', 'judgings', 'submissions');
  }

  @Patch(':id/ignore')
  @Roles('admin', 'jury')
  async ignoreSubmission(@NumberParam('id') id: number): Promise<void> {
    await this.submissionsService.setValid(id, false);
    this.socketService.pingForUpdates('all', 'judgings', 'submissions');
  }

  @Patch(':id/un-ignore')
  @Roles('admin', 'jury')
  async unIgnoreSubmission(@NumberParam('id') id: number): Promise<void> {
    await this.submissionsService.setValid(id, true);
    this.socketService.pingForUpdates('all', 'judgings', 'submissions');
  }

  @Get(':id/run/:runId/content')
  @Roles('admin', 'judge-host')
  getRunContent(
    @NumberParam('id') id: number,
    @NumberParam('runId') runId: number
  ): Promise<FileContent> {
    return this.judgingRunsService
      .getById(runId, ['runOutput'])
      .then((run) => this.filesService.getById(run.runOutput.id, ['content']))
      .then((file) => file.content);
  }
}
