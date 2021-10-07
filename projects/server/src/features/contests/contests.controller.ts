import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Patch,
  Post,
  Put,
  Session,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LogClass } from '../../core/log.decorator';
import { Roles } from '../../core/roles.decorator';
import { NumberParam } from '../../core/utils';
import { Clarification, Contest, Submission, User } from '../../entities';
import { AuthenticatedGuard } from '../../guards';
import { ClarificationsService } from '../clarifications/clarifications.service';
import { LanguagesService } from '../languages/languages.service';
import { ScoreboardService } from '../scoreboard/scoreboard.service';
import { SubmissionsService } from '../submissions/submissions.service';
import { TeamsService } from '../teams/teams.service';
import { WebsocketGateway } from '../websocket/websocket.gateway';
import { ContestsService } from './contests.service';

@LogClass
@ApiTags('Contests')
@ApiForbiddenResponse({ description: 'Forbidden' })
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@Controller('contests')
@UseGuards(AuthenticatedGuard)
export class ContestsController {
  constructor(
    private readonly socketService: WebsocketGateway,
    private readonly teamsService: TeamsService,
    private readonly contestsService: ContestsService,
    private readonly languagesService: LanguagesService,
    private readonly scoreboardService: ScoreboardService,
    private readonly submissionsService: SubmissionsService,
    private readonly clarificationsService: ClarificationsService
  ) {}

  @ApiOkResponse({ description: 'List of contests', type: [Contest] })
  @Get()
  @Roles('admin', 'jury')
  getAll(): Promise<Contest[]> {
    return this.contestsService.getAll();
  }

  @ApiCreatedResponse({ description: 'Contest created', type: Contest })
  @Post()
  @Roles('admin')
  create(@Body() contest: Contest): Promise<Contest> {
    return this.contestsService.save(contest);
  }

  @ApiOkResponse({ description: 'Contest updated', type: Contest })
  @Put(':id')
  @Roles('admin')
  async update(@NumberParam('id') id: number, @Body() contest: Contest): Promise<Contest> {
    contest = await this.contestsService.update(id, contest);
    await this.scoreboardService.refreshScoreForContest(contest);
    this.socketService.pingForUpdates('all', 'contests', 'submissions');
    return contest;
  }

  @ApiOkResponse({ description: 'Contest deleted' })
  @Delete(':id')
  @Roles('admin')
  delete(@NumberParam('id') id: number): Promise<void> {
    return this.contestsService.delete(id);
  }

  @ApiOkResponse({ description: 'Contest scoreboard cache refreshed' })
  @ApiNotFoundResponse({ description: 'Contest not found' })
  @Patch(':id/refresh-scoreboard-cache')
  @Roles('admin', 'jury')
  async refreshScoreboardCache(@NumberParam('id') id: number): Promise<void> {
    const contest = await this.contestsService.getById(id, [
      'teams',
      'problems',
      'problems.problem',
    ]);
    await this.scoreboardService.refreshScoreForContest(contest);
  }

  @ApiOkResponse({ description: 'List of contest clarifications', type: [Clarification] })
  @Get(':id/clarifications')
  @Roles('admin', 'jury')
  getClarifications(@NumberParam('id') contestId: number): Promise<Clarification[]> {
    return this.clarificationsService.getByContestId(contestId);
  }

  @ApiOkResponse({
    description: 'List of contest clarifications related to a specific team',
    type: [Clarification],
  })
  @Get(':id/team/:teamId/clarifications')
  @Roles('admin', 'team')
  getClarificationsForTeam(
    @NumberParam('id') contestId: number,
    @NumberParam('teamId') teamId: number
  ): Promise<Clarification[]> {
    return this.clarificationsService.getByContestIdAndTeamId(contestId, teamId);
  }

  @ApiOkResponse({ description: 'Set a clarification message as seen' })
  @Patch(':id/clarifications/:clarificationId/message/:messageId/set-as-seen')
  @Roles('admin', 'team', 'jury')
  async setClarificationMessageAsSeen(
    @NumberParam('id') contestId: number,
    @NumberParam('clarificationId') clarificationId: number,
    @NumberParam('messageId') messageId: number,
    @Session()
    {
      passport: {
        user: { id: userId },
      },
    }
  ): Promise<void> {
    const clarificationMessage =
      await this.clarificationsService.getMessageByClarificationIdAndContestId(
        messageId,
        clarificationId,
        contestId
      );

    if (clarificationMessage.sentBy.id === userId) {
      throw new BadRequestException();
    }

    clarificationMessage.seen = true;

    await this.clarificationsService.saveMessage(clarificationMessage);
  }

  @ApiCreatedResponse({ description: 'Clarification messages saved', type: Clarification })
  @ApiNotFoundResponse({ description: 'Team or Clarification not found' })
  @Post(':id/clarifications')
  @Roles('admin', 'team', 'jury')
  async teamSendClarifications(
    @NumberParam('id') contestId: number,
    @Session()
    {
      passport: {
        user: { id: userId, role },
      },
    },
    @Body() clarification: Clarification
  ): Promise<Clarification> {
    clarification.contest = { id: contestId } as Contest;
    if (clarification.id) {
      const dbClarification = await this.clarificationsService.getByIdAndContestId(
        clarification.id,
        contestId
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
          .map((message) => this.clarificationsService.saveMessage(message))
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
    if (role.name === 'team') {
      this.socketService.pingForUpdates('juries', 'clarifications');
    } else {
      this.socketService.pingForUpdates(
        clarification.team ? `team-${clarification.team.id}` : 'all',
        'clarifications'
      );
    }
    return this.clarificationsService.getByIdAndContestId(clarification.id, contestId);
  }

  @ApiOkResponse({ description: 'Team submissions in the contest', type: [Submission] })
  @Get(':id/team/:teamId/submissions')
  @Roles('admin', 'team')
  async getByContestAndTeam(
    @NumberParam('id') contestId: number,
    @NumberParam('teamId') teamId: number,
    @Session()
    { passport: { user } }
  ): Promise<Submission[]> {
    if (user.role.name === 'team') {
      const team = await this.teamsService.getByUserId(user.id);
      if (team.id !== teamId) throw new ForbiddenException();

      const contest = await this.contestsService.getById(contestId, ['teams']);
      if (!contest.teams.some((t) => t.id === teamId)) throw new ForbiddenException();
    }

    return this.submissionsService.getByContestIdAndTeamId(contestId, teamId);
  }

  @ApiOkResponse({ description: 'Team submission created' })
  @Post(':id/team/:teamId/submit')
  @Roles('admin', 'team')
  async submit(
    @NumberParam('id') contestId: number,
    @Session()
    {
      passport: {
        user: { id: userId },
      },
    },
    @Body() submission: Submission
  ): Promise<void> {
    submission.submitTime = new Date();
    const contest = await this.contestsService.getByIdAndRunningInTime(
      contestId,
      submission.submitTime
    );
    const team = await this.teamsService.getByUserId(userId);
    if (!contest?.openToAllTeams && !contest?.teams.find((t) => t.id === team.id)) {
      throw new ForbiddenException('Your team is not allowed to submit in this contest!');
    }
    const language = await this.languagesService.getById(submission.language.id);
    if (!language?.allowSubmit) {
      throw new BadRequestException(
        `It is not allowed to submit using the language '${language.name}'`
      );
    }
    const contestProblem = contest.problems.find((p) => submission.problem.id === p.problem.id);
    if (!contestProblem?.allowSubmit) {
      throw new BadRequestException(
        `It is not allowed to submit to the problem '${contestProblem.shortName} - ${contestProblem.problem.name}'`
      );
    }
    submission.contest = contest;
    submission.team = team;
    await this.submissionsService.save(submission);
    await this.scoreboardService.refreshScoreCache(contest, team, submission.problem);
    this.socketService.pingForUpdates('all', 'submissions', 'judgeRuns');
  }
}
