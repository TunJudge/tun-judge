import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThan } from 'typeorm';
import { ExtendedRepository } from '../core/extended-repository';
import { cleanNullProblems } from '../core/utils';
import { Contest } from '../entities';
import { ContestProblemsService } from './contest-problems.service';
import { ProblemsService } from './problems.service';
import { TeamsService } from './teams.service';

@Injectable()
export class ContestsService {
  constructor(
    @InjectRepository(Contest)
    private readonly contestsRepository: ExtendedRepository<Contest>,
    private readonly contestProblemsService: ContestProblemsService,
    private readonly problemsService: ProblemsService,
    private readonly teamsService: TeamsService,
  ) {}

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

  getAllWithRelations(relations: string[]): Promise<Contest[]> {
    return this.contestsRepository.find({ relations });
  }

  getPublicById(id: number): Promise<Contest> {
    return this.contestsRepository.findOne({
      id: id,
      enabled: true,
      startTime: LessThanOrEqual(new Date()),
    });
  }

  async getAllActive(): Promise<Contest[]> {
    return (
      await this.contestsRepository.find({
        relations: ['teams', 'problems', 'problems.problem'],
        order: { activateTime: 'ASC' },
        where: {
          enabled: true,
          activateTime: LessThanOrEqual(new Date()),
        },
      })
    ).map(cleanNullProblems);
  }

  getById(id: number, relations: string[] = []): Promise<Contest> {
    return this.contestsRepository.findOneOrThrow(
      { where: { id }, relations },
      new NotFoundException('Contest not found!'),
    );
  }

  getByIdAndRunningInTime(id: number, date: Date): Promise<Contest> {
    return this.contestsRepository.findOneOrThrow(
      {
        where: {
          id: id,
          startTime: LessThanOrEqual(date),
          endTime: MoreThan(date),
        },
        relations: ['teams', 'problems', 'problems.problem'],
      },
      new NotFoundException('Contest not found!'),
    );
  }

  save(contest: Contest): Promise<Contest> {
    return this.contestsRepository.save(contest);
  }

  async update(id: number, contest: Contest): Promise<Contest> {
    const oldContest = await this.contestsRepository.findOneOrThrow(
      id,
      new NotFoundException('Contest not found'),
    );
    await this.contestProblemsService.deleteByContestId(id);
    return await this.contestsRepository.save({
      ...oldContest,
      ...contest,
    });
  }

  async delete(id: number): Promise<void> {
    await this.contestProblemsService.deleteByContestId(id);
    await this.contestsRepository.delete(id);
  }

  async deepSave(contest: Contest): Promise<Contest> {
    const problems = contest.problems;
    const teams = contest.teams;
    contest.problems = [];
    contest.teams = [];
    contest = await this.save(contest);
    for (const problem of problems ?? []) {
      try {
        problem.contest = contest;
        problem.problem = await this.problemsService.deepSave(problem.problem);
        await this.contestProblemsService.save(problem);
      } catch (_) {}
    }
    for (const team of teams ?? []) {
      try {
        team.contests = [contest];
        await this.teamsService.deepSave(team);
      } catch (_) {}
    }
    return contest;
  }
}
