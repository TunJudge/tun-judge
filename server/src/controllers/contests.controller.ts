import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard, AuthenticatedGuard, TeamGuard } from '../core/guards';
import { ExtendedRepository } from '../core/extended-repository';
import { Contest, ContestProblem, Submission, Team } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThan } from 'typeorm';
import { ScoreboardService } from '../scoreboard.service';

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
  ) {}

  @Get()
  @UseGuards(AdminGuard)
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
  @UseGuards(AdminGuard)
  create(@Body() contest: Contest): Promise<Contest> {
    return this.contestsRepository.save(contest);
  }

  @Put(':id')
  @UseGuards(AdminGuard)
  async update(
    @Param('id') id: number,
    @Body() contest: Contest,
  ): Promise<Contest> {
    const oldContest = await this.contestsRepository.findOneOrThrow(
      id,
      new NotFoundException(),
    );
    await this.contestProblemsRepository.delete({
      contest: { id },
    });
    return this.contestsRepository.save({ ...oldContest, ...contest });
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  async delete(@Param('id') id: number): Promise<void> {
    await this.contestProblemsRepository.delete({ contest: { id } });
    await this.contestsRepository.delete(id);
  }

  @Get(':id/team/:teamId/submissions')
  @UseGuards(TeamGuard)
  async getByContestAndTeam(
    @Param('id') contestId: number,
    @Param('teamId') teamId: number,
  ): Promise<Submission[]> {
    return (
      await this.submissionsRepository.find({
        order: { submitTime: 'DESC' },
        where: { contest: { id: contestId }, team: { id: teamId } },
        relations: ['language', 'contest', 'problem', 'judgings'],
      })
    ).map((submission) => {
      if (submission.contest.verificationRequired) {
        submission.judgings = submission.judgings.filter((j) => j.verified);
      }
      return submission;
    });
  }

  @Post(':id/team/:teamId/submit')
  @UseGuards(TeamGuard)
  async submit(
    @Param('id') contestId: number,
    @Param('teamId') teamId: number,
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
      teamId,
      new NotFoundException('Team not found!'),
    );
    submission.contest = contest;
    submission.team = team;
    await this.submissionsRepository.save(submission);
    await this.scoreboardService.refreshScores();
  }
}
