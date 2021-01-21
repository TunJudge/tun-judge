import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AuthenticatedGuard } from '../core/guards';
import { ExtendedRepository } from '../core/extended-repository';
import {
  Contest,
  ContestProblem,
  Judging,
  Submission,
  Team,
} from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThan } from 'typeorm';
import { ScoreboardService } from '../services';
import { Roles } from '../core/roles.decorator';
import { AppGateway } from '../app.gateway';

@Controller('contests')
@UseGuards(AuthenticatedGuard)
export class ContestsController {
  constructor(
    @InjectRepository(Contest)
    private readonly contestsRepository: ExtendedRepository<Contest>,
    @InjectRepository(ContestProblem)
    private readonly contestProblemsRepository: ExtendedRepository<ContestProblem>,
    @InjectRepository(Team)
    private readonly teamsRepository: ExtendedRepository<Team>,
    @InjectRepository(Submission)
    private readonly submissionsRepository: ExtendedRepository<Submission>,
    private readonly scoreboardService: ScoreboardService,
    private readonly socketService: AppGateway,
  ) {}

  @Get()
  @Roles('admin', 'jury')
  getAll(): Promise<Contest[]> {
    return this.contestsRepository
      .find({
        relations: ['problems', 'problems.problem', 'teams'],
        order: { id: 'ASC' },
      })
      .then((data) =>
        data.map((c) => ({
          ...c,
          problems: c.problems.filter((p) => p.problem !== null),
        })),
      );
  }

  @Post()
  @Roles('admin')
  create(@Body() contest: Contest): Promise<Contest> {
    return this.contestsRepository.save(contest);
  }

  @Put(':id')
  @Roles('admin')
  async update(
    @Param('id') id: number,
    @Body() contest: Contest,
  ): Promise<void> {
    const oldContest = await this.contestsRepository.findOneOrThrow(
      id,
      new NotFoundException(),
    );
    await this.contestProblemsRepository.delete({
      contest: { id },
    });
    await this.contestsRepository.save({ ...oldContest, ...contest });
    this.socketService.pingForUpdates('contests');
  }

  @Patch(':id/refresh-scoreboard-cache')
  @Roles('admin', 'jury')
  async refreshScoreboardCache(@Param('id') id: number): Promise<void> {
    const contest = await this.contestsRepository.findOneOrThrow(
      { where: { id }, relations: ['teams', 'problems', 'problems.problem'] },
      new NotFoundException(),
    );
    await this.scoreboardService.refreshScoreForContest(contest);
  }

  @Delete(':id')
  @Roles('admin')
  async delete(@Param('id') id: number): Promise<void> {
    await this.contestProblemsRepository.delete({ contest: { id } });
    await this.contestsRepository.delete(id);
  }

  @Get(':id/team/:teamId/submissions')
  @Roles('admin', 'team')
  async getByContestAndTeam(
    @Param('id') contestId: number,
    @Param('teamId') teamId: number,
  ): Promise<Submission[]> {
    return (
      await this.submissionsRepository.find({
        where: {
          contest: { id: contestId },
          team: { id: teamId },
          valid: true,
        },
        relations: ['language', 'contest', 'problem', 'judgings'],
        order: { submitTime: 'DESC' },
      })
    ).map((submission) => {
      if (submission.contest.verificationRequired) {
        const judging = submission.judgings
          .sort((a, b) => b.startTime.getTime() - a.startTime.getTime())
          .shift();
        submission.judgings =
          judging?.verified && !judgingInFreezeTime(submission.contest, judging)
            ? [judging]
            : [];
      }
      return submission;
    });
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
    const contest = await this.contestsRepository.findOneOrThrow(
      {
        id: contestId,
        startTime: LessThanOrEqual(submission.submitTime),
        endTime: MoreThan(submission.submitTime),
      },
      new NotFoundException('Contest not found!'),
    );
    const team = await this.teamsRepository.findOneOrThrow(
      { user: { id: userId } },
      new NotFoundException('Team not found!'),
    );
    submission.contest = contest;
    submission.team = team;
    await this.submissionsRepository.save(submission);
    await this.scoreboardService.refreshScoreCache(
      contest,
      team,
      submission.problem,
    );
    this.socketService.pingForUpdates('submissions');
  }
}

function judgingInFreezeTime(
  { freezeTime, unfreezeTime, endTime }: Contest,
  judging: Judging,
): boolean {
  freezeTime ??= endTime;
  unfreezeTime ??= endTime;
  const now = Date.now();
  return (
    freezeTime !== unfreezeTime &&
    judging.startTime.getTime() >= freezeTime.getTime() &&
    judging.startTime.getTime() < unfreezeTime.getTime() &&
    now >= freezeTime.getTime() &&
    now < unfreezeTime.getTime()
  );
}
