import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtendedRepository } from '../core/extended-repository';
import { Problem } from '../entities';
import { ExecutablesService } from './executables.service';
import { TestcasesService } from './testcases.service';

@Injectable()
export class ProblemsService {
  constructor(
    @InjectRepository(Problem)
    private readonly problemsRepository: ExtendedRepository<Problem>,
    private readonly executablesService: ExecutablesService,
    private readonly testcasesService: TestcasesService,
  ) {}

  getAll(): Promise<Problem[]> {
    return this.problemsRepository.find({
      order: { id: 'ASC' },
      relations: [
        'file',
        'file.content',
        'testcases',
        'runScript',
        'checkScript',
      ],
    });
  }

  getAllWithRelations(relations: string[]): Promise<Problem[]> {
    return this.problemsRepository.find({ relations });
  }

  getById(id: number, relations: string[] = []): Promise<Problem> {
    return this.problemsRepository.findOneOrThrow(
      { where: { id }, relations },
      new NotFoundException('Problem not found!'),
    );
  }

  save(problem: Problem): Promise<Problem> {
    return this.problemsRepository.save(problem);
  }

  async update(id: number, problem: Problem): Promise<Problem> {
    const oldProblem = await this.problemsRepository.findOneOrThrow(
      id,
      new NotFoundException('Problem not found!'),
    );
    return this.save({ ...oldProblem, ...problem });
  }

  async delete(id: number): Promise<void> {
    await this.problemsRepository.delete(id);
  }

  async deepSave(problem: Problem): Promise<Problem> {
    problem.runScript = await this.executablesService.getDefaultByType(
      'RUNNER',
    );
    problem.checkScript = await this.executablesService.getDefaultByType(
      'CHECKER',
    );
    const testcases = problem.testcases;
    problem = await this.problemsRepository.save(problem);
    await Promise.all(
      testcases.map((testcase) =>
        this.testcasesService.create(problem.id, testcase),
      ),
    );
    return problem;
  }
}
