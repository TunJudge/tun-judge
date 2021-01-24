import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtendedRepository } from '../core/extended-repository';
import { Executable, Problem, Testcase } from '../entities';

@Injectable()
export class ProblemsService {
  constructor(
    @InjectRepository(Problem)
    private readonly problemsRepository: ExtendedRepository<Problem>,
    @InjectRepository(Executable)
    private readonly executablesRepository: ExtendedRepository<Executable>,
    @InjectRepository(Testcase)
    private readonly testcasesRepository: ExtendedRepository<Testcase>,
  ) {}

  async deepSave(problem: Problem): Promise<Problem> {
    problem.runScript = await this.executablesRepository.findOneOrThrow(
      {
        default: true,
        type: 'RUNNER',
      },
      new NotFoundException(),
    );
    problem.checkScript = await this.executablesRepository.findOneOrThrow(
      {
        default: true,
        type: 'CHECKER',
      },
      new NotFoundException(),
    );
    const testcases = problem.testcases;
    problem = await this.problemsRepository.save(problem);
    testcases.forEach((testcase) => (testcase.problem = problem));
    await this.testcasesRepository.save(testcases);
    return problem;
  }
}
