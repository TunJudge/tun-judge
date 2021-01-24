import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Res,
  Session,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import * as JSZip from 'jszip';
import { LessThanOrEqual, MoreThan } from 'typeorm';
import { AppGateway } from '../app.gateway';
import { ExtendedRepository } from '../core/extended-repository';
import { AuthenticatedGuard } from '../core/guards';
import { Roles } from '../core/roles.decorator';
import { submissionInFreezeTime } from '../core/utils';
import { Contest, ContestProblem, Submission, Team } from '../entities';
import { ScoreboardService } from '../services';
import { ContestTransformer } from '../transformers';

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
    private readonly contestTransformer: ContestTransformer,
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
    contest = await this.contestsRepository.save({
      ...oldContest,
      ...contest,
    });
    await this.scoreboardService.refreshScoreForContest(contest);
    this.socketService.pingForUpdates('contests', 'submissions');
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
      const inFreezeTime = submissionInFreezeTime(submission.contest)(
        submission,
      );
      if (submission.contest.verificationRequired || inFreezeTime) {
        const judging = submission.judgings
          .sort((a, b) => b.startTime.getTime() - a.startTime.getTime())
          .shift();
        submission.judgings =
          judging?.verified && !inFreezeTime ? [judging] : [];
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
        where: {
          id: contestId,
          startTime: LessThanOrEqual(submission.submitTime),
          endTime: MoreThan(submission.submitTime),
        },
        relations: ['teams'],
      },
      new NotFoundException('Contest not found!'),
    );
    const team = await this.teamsRepository.findOneOrThrow(
      { user: { id: userId } },
      new NotFoundException('Team not found!'),
    );
    if (
      !contest.openToAllTeams &&
      !contest.teams.find((t) => t.id === team.id)
    ) {
      throw new ForbiddenException(
        'Your team is not allowed to submit in this contest',
      );
    }
    submission.contest = contest;
    submission.team = team;
    await this.submissionsRepository.save(submission);
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
    const contest = await this.contestsRepository.findOneOrThrow(
      { where: { id }, relations: ['problems', 'problems.problem'] },
      new NotFoundException(),
    );
    const zip = new JSZip();
    await this.contestTransformer.toZip(contest, zip);
    response.attachment('contest.zip');
    zip.generateNodeStream().pipe(response);
  }

  @Post('unzip')
  @Roles('admin')
  @UseInterceptors(FileInterceptor('file'))
  async saveFromZip(@UploadedFile() file): Promise<void> {
    const contest = await this.contestTransformer.fromZip(
      await JSZip.loadAsync(file.buffer),
    );
    await this.contestsRepository.save(contest);
  }
}
