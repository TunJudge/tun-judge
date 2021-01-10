import { Controller, Get, Param } from '@nestjs/common';
import { ExtendedRepository } from '../core/extended-repository';
import { Contest, ContestProblem } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual } from 'typeorm';

@Controller('public')
export class PublicController {
  constructor(
    @InjectRepository(Contest)
    private readonly contestsRepository: ExtendedRepository<Contest>,
    @InjectRepository(ContestProblem)
    private readonly contestProblemsRepository: ExtendedRepository<ContestProblem>,
  ) {}

  @Get('contests')
  getContests(): Promise<Contest[]> {
    return this.contestsRepository
      .find({
        relations: ['problems', 'problems.problem', 'teams'],
        order: { activateTime: 'ASC' },
        where: {
          public: true,
          enabled: true,
          activateTime: LessThanOrEqual(new Date()),
        },
      })
      .then((data) =>
        data.map((c) => ({
          ...c,
          problems: c.problems.filter((p) => p.problem !== null),
        })),
      );
  }

  @Get('contest/:id/problems')
  getProblems(@Param('id') contestId: number): Promise<ContestProblem[]> {
    return this.contestProblemsRepository.find({
      order: { shortName: 'ASC' },
      where: { contest: { id: contestId } },
      relations: ['problem', 'problem.file', 'problem.file.content'],
    });
  }
}
