import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtendedRepository } from '../core/extended-repository';
import { Contest, ContestProblem } from '../entities';
import { ProblemsService } from './problems.service';
import { TeamsService } from './teams.service';

@Injectable()
export class ContestsService {
  constructor(
    @InjectRepository(Contest)
    private readonly contestsRepository: ExtendedRepository<Contest>,
    @InjectRepository(ContestProblem)
    private readonly contestProblemsRepository: ExtendedRepository<ContestProblem>,
    private readonly problemsService: ProblemsService,
    private readonly teamsService: TeamsService,
  ) {}

  async deepSave(contest: Contest): Promise<Contest> {
    const problems = contest.problems;
    const teams = contest.teams;
    contest.problems = [];
    contest.teams = [];
    contest = await this.contestsRepository.save(contest);
    for (const problem of problems ?? []) {
      try {
        problem.contest = contest;
        problem.problem = await this.problemsService.deepSave(problem.problem);
        await this.contestProblemsRepository.save(problem);
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
