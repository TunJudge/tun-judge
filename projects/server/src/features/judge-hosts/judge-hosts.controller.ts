import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { LogClass } from '../../core/log.decorator';
import { Roles } from '../../core/roles.decorator';
import { BoolParam, NumberParam } from '../../core/utils';
import { Contest, JudgeHost, Judging, JudgingRun, Submission } from '../../entities';
import { AuthenticatedGuard } from '../../guards';
import { ScoreboardService } from '../scoreboard/scoreboard.service';
import { SubmissionsService } from '../submissions/submissions.service';
import { UsersService } from '../users/users.service';
import { WebsocketGateway } from '../websocket/websocket.gateway';
import { JudgeHostsService } from './judge-hosts.service';
import { JudgingRunsService } from './judging-runs.service';
import { JudgingsService } from './judgings.service';

@LogClass
@ApiTags('Judge Hosts')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@Controller('judge-hosts')
@UseGuards(AuthenticatedGuard)
export class JudgeHostsController {
  constructor(
    private readonly usersService: UsersService,
    private readonly judgingsService: JudgingsService,
    private readonly judgingRunsService: JudgingRunsService,
    private readonly submissionsService: SubmissionsService,
    private readonly judgeHostsService: JudgeHostsService,
    private readonly scoreboardService: ScoreboardService,
    private readonly websocketGateway: WebsocketGateway
  ) {}

  @Get()
  @Roles('admin', 'jury')
  getAll(): Promise<JudgeHost[]> {
    return this.judgeHostsService.getAll();
  }

  @Patch(':id/toggle/:active')
  @Roles('admin')
  toggle(@NumberParam('id') id: number, @BoolParam('active') active: boolean): Promise<void> {
    return this.judgeHostsService.toggle(id, active);
  }

  @Post('subscribe')
  @Roles('admin', 'judge-host')
  async subscribe(@Body() { hostname, username }: any): Promise<void> {
    const user = await this.usersService.getByUsername(username);
    if (await this.judgeHostsService.count({ hostname })) {
      await this.judgeHostsService.update({ hostname }, { user, pollTime: new Date() });
    } else {
      await this.judgeHostsService.save({
        hostname: hostname,
        user: user,
        active: true,
        pollTime: new Date(),
      });
    }
  }

  @Put(':hostname/update-judging/:id')
  @Roles('admin', 'judge-host')
  async updateJudging(
    @Param('hostname') hostname: string,
    @NumberParam('id') judgingId: number,
    @Body() judging: Judging
  ): Promise<void> {
    const oldJudging = await this.judgingsService.getById(judgingId, [
      'contest',
      'submission',
      'submission.team',
      'submission.problem',
    ]);
    await this.judgingsService.save({ ...oldJudging, ...judging });
    await this.scoreboardService.refreshScoreCache(
      oldJudging.contest,
      oldJudging.submission.team,
      oldJudging.submission.problem
    );
    this.websocketGateway.pingForUpdates('juries', 'judgings', 'submissions');
  }

  @Post(':hostname/add-judging-run/:id')
  @Roles('admin', 'judge-host')
  async addJudgingRun(
    @Param('hostname') hostname: string,
    @NumberParam('id') judgingId: number,
    @Body() judgingRun: JudgingRun
  ): Promise<void> {
    await this.judgingsService.getById(judgingId);
    await this.judgingRunsService.save(judgingRun);
    this.websocketGateway.pingForUpdates('juries', 'judgeRuns');
  }

  @Get(':hostname/next-judging')
  @Roles('admin', 'judge-host')
  async getNextJudging(@Param('hostname') hostname: string): Promise<Judging | undefined> {
    const judgeHost = await this.judgeHostsService.update({ hostname }, { pollTime: new Date() });
    if (!judgeHost.active) return undefined;
    const submission = await this.submissionsService.getNextSubmission();
    if (submission) {
      let judging = await this.judgingsService.getUnfinishedBySubmissionId(submission.id);
      judging = await this.judgingsService.save({
        ...judging,
        startTime: new Date(),
        contest: { id: submission.contest.id } as Contest,
        judgeHost: { id: judgeHost.id } as JudgeHost,
        submission: { id: submission.id } as Submission,
      });
      submission.judgeHost = judgeHost;
      await this.submissionsService.save(submission);
      judging.submission = submission;
      judging.judgeHost = judgeHost;
      this.websocketGateway.pingForUpdates('juries', 'judgings');
      return judging;
    }
  }

  @Delete(':id')
  @Roles('admin')
  async delete(@NumberParam('id') id: number): Promise<void> {
    await this.judgeHostsService.delete(id);
  }
}
