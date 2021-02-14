import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Res,
  Session,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { AppGateway } from '../app.gateway';
import { AuthenticatedGuard } from '../core/guards';
import { Roles } from '../core/roles.decorator';
import { unzipEntities, zipEntities } from '../core/utils';
import { Clarification, Contest, Submission, User } from '../entities';
import {
  ClarificationsService,
  ContestsService,
  ScoreboardService,
  SubmissionsService,
  TeamsService,
} from '../services';
import { ContestTransformer } from '../transformers';

@Controller('contests')
@UseGuards(AuthenticatedGuard)
export class ContestsController {
  constructor(
    private readonly socketService: AppGateway,
    private readonly teamsService: TeamsService,
    private readonly contestsService: ContestsService,
    private readonly scoreboardService: ScoreboardService,
    private readonly contestTransformer: ContestTransformer,
    private readonly submissionsService: SubmissionsService,
    private readonly clarificationsService: ClarificationsService,
  ) {}

  @Get()
  @Roles('admin', 'jury')
  getAll(): Promise<Contest[]> {
    return this.contestsService.getAll();
  }

  @Post()
  @Roles('admin')
  create(@Body() contest: Contest): Promise<Contest> {
    return this.contestsService.save(contest);
  }

  @Put(':id')
  @Roles('admin')
  async update(
    @Param('id') id: number,
    @Body() contest: Contest,
  ): Promise<void> {
    contest = await this.contestsService.update(id, contest);
    await this.scoreboardService.refreshScoreForContest(contest);
    this.socketService.pingForUpdates('contests', 'submissions');
  }

  @Delete(':id')
  @Roles('admin')
  delete(@Param('id') id: number): Promise<void> {
    return this.contestsService.delete(id);
  }

  @Patch(':id/refresh-scoreboard-cache')
  @Roles('admin', 'jury')
  async refreshScoreboardCache(@Param('id') id: number): Promise<void> {
    const contest = await this.contestsService.getById(id, [
      'teams',
      'problems',
      'problems.problem',
    ]);
    await this.scoreboardService.refreshScoreForContest(contest);
  }

  @Get(':id/clarifications')
  @Roles('admin', 'jury')
  async getClarifications(
    @Param('id') contestId: number,
  ): Promise<Clarification[]> {
    return this.clarificationsService.getByContestId(contestId);
  }

  @Get(':id/team/:teamId/clarifications')
  @Roles('admin', 'team')
  async getClarificationsForTeam(
    @Param('id') contestId: number,
    @Param('teamId') teamId: number,
  ): Promise<Clarification[]> {
    return this.clarificationsService.getByContestIdAndTeamId(
      contestId,
      teamId,
    );
  }

  @Post(':id/clarifications')
  @Roles('admin', 'team', 'jury')
  async teamSendClarifications(
    @Param('id') contestId: number,
    @Session()
    {
      passport: {
        user: { id: userId, role },
      },
    },
    @Body() clarification: Clarification,
  ): Promise<Clarification> {
    clarification.contest = { id: contestId } as Contest;
    if (clarification.id) {
      const dbClarification = await this.clarificationsService.getByIdAndContestId(
        clarification.id,
        contestId,
      );
      await Promise.all(
        clarification.messages
          .filter((message) => !message.id)
          .map((message) => ({
            ...message,
            sentBy: { id: userId } as User,
            sentTime: new Date(),
            clarification: dbClarification,
          }))
          .map((message) => this.clarificationsService.saveMessage(message)),
      );
    } else {
      if (role.name === 'team') {
        clarification.team = await this.teamsService.getByUserId(userId);
      }
      clarification.messages
        .filter((message) => !message.id)
        .forEach((message) => {
          message.sentBy = { id: userId } as User;
          message.sentTime = new Date();
        });
      clarification = await this.clarificationsService.save(clarification);
    }
    return this.clarificationsService.getByIdAndContestId(
      clarification.id,
      contestId,
    );
  }

  @Get(':id/team/:teamId/submissions')
  @Roles('admin', 'team')
  async getByContestAndTeam(
    @Param('id') contestId: number,
    @Param('teamId') teamId: number,
  ): Promise<Submission[]> {
    return this.submissionsService.getByContestIdAndTeamId(contestId, teamId);
  }

  @Post(':id/team/:teamId/submit')
  @Roles('admin', 'team')
  async submit(
    @Param('id') contestId: number,
    @Session()
    {
      passport: {
        user: { id: userId },
      },
    },
    @Body() submission: Submission,
  ): Promise<void> {
    submission.submitTime = new Date();
    const contest = await this.contestsService.getByIdAndRunningInTime(
      contestId,
      submission.submitTime,
    );
    const team = await this.teamsService.getByUserId(userId);
    if (
      !contest.openToAllTeams &&
      !contest.teams.find((t) => t.id === team.id)
    ) {
      throw new ForbiddenException(
        'Your team is not allowed to submit in this contest!',
      );
    }
    submission.contest = contest;
    submission.team = team;
    await this.submissionsService.save(submission);
    await this.scoreboardService.refreshScoreCache(
      contest,
      team,
      submission.problem,
    );
    this.socketService.pingForUpdates('submissions', 'judgeRuns');
  }

  @Get(':id/zip')
  @Roles('admin')
  async getZip(
    @Param('id') id: number,
    @Res() response: Response,
  ): Promise<void> {
    return zipEntities(
      id,
      'contest.zip',
      this.contestTransformer,
      await this.contestsService.getById(id, [
        'teams',
        'teams.user',
        'teams.category',
        'problems',
        'problems.problem',
        'problems.problem.file',
        'problems.problem.file.content',
        'problems.problem.testcases',
        'problems.problem.testcases.input',
        'problems.problem.testcases.input.content',
        'problems.problem.testcases.output',
        'problems.problem.testcases.output.content',
      ]),
      response,
    );
  }

  @Get('zip/all')
  @Roles('admin')
  async getZipAll(@Res() response: Response): Promise<void> {
    return zipEntities(
      undefined,
      'contests.zip',
      this.contestTransformer,
      await this.contestsService.getAllWithRelations([
        'teams',
        'teams.user',
        'teams.category',
        'problems',
        'problems.problem',
        'problems.problem.file',
        'problems.problem.file.content',
        'problems.problem.testcases',
        'problems.problem.testcases.input',
        'problems.problem.testcases.input.content',
        'problems.problem.testcases.output',
        'problems.problem.testcases.output.content',
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
    return unzipEntities<Contest>(
      file,
      multiple,
      this.contestTransformer,
      (contest) => this.contestsService.deepSave(contest),
    );
  }
}
